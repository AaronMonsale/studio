'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_CREDENTIALS, KITCHEN_CREDENTIALS, findStaffByPin } from './data';
import type { UserSession } from './types';

const COOKIE_NAME = 'swiftpos-session';

async function createSession(sessionData: UserSession, redirectTo: string) {
  cookies().set(COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });
  redirect(redirectTo);
}

export async function getSession(): Promise<UserSession | null> {
    const sessionCookie = cookies().get(COOKIE_NAME);
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
  cookies().delete(COOKIE_NAME);
  redirect('/login');
}

type AuthState = {
  error?: string;
};

export async function adminLogin(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const sessionData: UserSession = {
        isLoggedIn: true,
        userType: 'admin',
        name: ADMIN_CREDENTIALS.name,
        id: ADMIN_CREDENTIALS.id,
    };
    await createSession(sessionData, '/admin/dashboard');
    return {};
  } else {
    return { error: 'Invalid email or password.' };
  }
}

export async function staffLogin(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const pin = formData.get('pin') as string;
  const staffMember = findStaffByPin(pin);

  if (staffMember) {
     const sessionData: UserSession = {
        isLoggedIn: true,
        userType: 'staff',
        name: staffMember.name,
        id: staffMember.id,
    };
    await createSession(sessionData, '/staff');
    return {};
  } else {
    return { error: 'Invalid PIN. Please try again.' };
  }
}

export async function kitchenLogin(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const password = formData.get('password') as string;

  if (password === KITCHEN_CREDENTIALS.password) {
    const sessionData: UserSession = {
        isLoggedIn: true,
        userType: 'kitchen',
        name: KITCHEN_CREDENTIALS.name,
        id: KITCHEN_CREDENTIALS.id
    };
    await createSession(sessionData, '/kitchen');
    return {};
  } else {
    return { error: 'Incorrect password for Kitchen Display.' };
  }
}
