'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_CREDENTIALS, findStaffByPin } from './data';
import type { UserSession } from './types';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

const COOKIE_NAME = 'swiftpos-session';

async function ensureDbConnected() {
  try {
    await (prisma as any).$connect?.();
  } catch {}
}

async function withDbRetry<T>(fn: () => Promise<T>): Promise<T> {
  await ensureDbConnected();
  try {
    return await fn();
  } catch (e) {
    // brief backoff and retry once to smooth over cold-start/hot-reload hiccups
    await new Promise((r) => setTimeout(r, 100));
    await ensureDbConnected();
    return await fn();
  }
}

async function createSession(sessionData: UserSession, redirectTo: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });
  redirect(redirectTo);
}

export async function getSession(): Promise<UserSession | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie) {
        return null;
    }
    try {
        return JSON.parse(sessionCookie.value);
    } catch {
        return null;
    }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/login');
}

type AuthState = {
  error?: string;
};

export async function adminLogin(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email and password are required.' };

  // Try database first with a safe retry (avoid false negatives on first attempt)
  let dbUser: { id: string; name: string | null } | null = null;
  try {
    dbUser = await withDbRetry(() => prisma.user.findFirst({ where: { email: email.toLowerCase(), password, role: UserRole.ADMIN } }));
  } catch {
    // ignore here, fallback checks below
  }
  if (dbUser) {
    const sessionData: UserSession = {
      isLoggedIn: true,
      userType: 'admin',
      name: dbUser.name || 'Admin',
      id: dbUser.id,
    };
    await createSession(sessionData, '/admin/dashboard');
    return {};
  }

  // Fallback to static credentials
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const sessionData: UserSession = {
      isLoggedIn: true,
      userType: 'admin',
      name: ADMIN_CREDENTIALS.name,
      id: ADMIN_CREDENTIALS.id,
    };
    await createSession(sessionData, '/admin/dashboard');
    return {};
  }

  return { error: 'Invalid email or password.' };
}

export async function staffLogin(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const pin = (formData.get('pin') as string | null)?.trim() || '';
  if (!pin) return { error: 'PIN is required.' };

  let user: { id: string; name: string | null } | null = null;
  try {
    user = await withDbRetry(() => prisma.user.findFirst({ where: { role: UserRole.STAFF, pin } }));
  } catch {
    // fall through to error
  }
  if (!user) return { error: 'Invalid PIN. Please try again.' };

  const sessionData: UserSession = {
    isLoggedIn: true,
    userType: 'staff',
    name: user.name || 'Staff',
    id: user.id,
  };
  await createSession(sessionData, '/staff');
  return {}
}

export async function kitchenLogin(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const password = (formData.get('password') as string | null) || '';
  if (!password) return { error: 'Password is required.' };

  let user: { id: string; name: string | null } | null = null;
  try {
    user = await withDbRetry(() => prisma.user.findFirst({ where: { role: UserRole.KITCHEN, password } }));
  } catch {
    // fall through
  }
  if (!user) return { error: 'Incorrect password for Kitchen Display.' };

  const sessionData: UserSession = {
    isLoggedIn: true,
    userType: 'kitchen',
    name: user.name || 'Kitchen',
    id: user.id,
  };
  await createSession(sessionData, '/kitchen');
  return {};
}

export async function registerAdmin(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const name = (formData.get('name') as string | null)?.trim() || '';
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() || '';
  const password = (formData.get('password') as string | null) || '';

  if (!name || !email || !password) {
    return { error: 'All fields are required.' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  try {
    const existing = await withDbRetry(() => prisma.user.findUnique({ where: { email } }));
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }
  } catch {}

  let created: { id: string; name: string | null } | null = null;
  try {
    created = await withDbRetry(() => prisma.user.create({
      data: {
        email,
        name,
        password,
        role: UserRole.ADMIN,
      },
    }));
  } catch {
    return { error: 'Registration failed. Please try again.' };
  }

  // Important: do not wrap redirect in try/catch, so Next.js can interrupt the action
  const sessionData: UserSession = {
    isLoggedIn: true,
    userType: 'admin',
    name: (created?.name as string | undefined) || 'Admin',
    id: created!.id,
  };
  await createSession(sessionData, '/admin/dashboard');
  return {};
}
