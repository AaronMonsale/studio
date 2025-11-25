'use server';

import prisma from '@/lib/db';
import { UserRole, PaymentStatus } from '@prisma/client';

// Employees
export async function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createUser(formData: FormData) {
  const name = (formData.get('name') as string | null)?.trim() || null;
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() || '';
  const password = (formData.get('password') as string | null) || null;
  const roleStr = (formData.get('role') as string | null) || 'STAFF';
  // Employee registration must not create ADMIN users
  const role = (['STAFF', 'KITCHEN'] as const).includes(roleStr as any)
    ? (roleStr as UserRole)
    : UserRole.STAFF;

  if (!email) {
    throw new Error('Email is required');
  }

  // NOTE: Password is stored as plaintext per current schema usage. Recommend hashing.
  await prisma.user.create({
    data: { email, name, password: password || undefined, role },
  });
}

// Menu
export async function listMenu() {
  return prisma.menuCategory.findMany({
    orderBy: { position: 'asc' },
    include: { items: { orderBy: { name: 'asc' } } },
  });
}

export async function createCategory(formData: FormData) {
  const name = (formData.get('name') as string | null)?.trim();
  if (!name) throw new Error('Category name is required');
  const position = (await prisma.menuCategory.count()) || 0;
  await prisma.menuCategory.create({ data: { name, position } });
}

export async function createMenuItem(formData: FormData) {
  const categoryId = (formData.get('categoryId') as string | null) || '';
  const name = (formData.get('name') as string | null)?.trim() || '';
  const description = (formData.get('description') as string | null) || null;
  const priceStr = (formData.get('price') as string | null) || '0';
  const price = Number(priceStr);
  if (!categoryId) throw new Error('Category is required');
  if (!name) throw new Error('Item name is required');
  await prisma.menuItem.create({
    data: { name, description: description || undefined, price, categoryId },
  });
}

// Tables
export async function listTables() {
  return prisma.table.findMany({ orderBy: { label: 'asc' } });
}

export async function createTable(formData: FormData) {
  const label = (formData.get('label') as string | null)?.trim();
  const capacity = Number((formData.get('capacity') as string | null) || '1');
  if (!label) throw new Error('Table label is required');
  await prisma.table.create({ data: { label, capacity } });
}

export async function bulkCreateTables(formData: FormData) {
  const prefix = (formData.get('prefix') as string | null)?.trim() || 'Table';
  const numberStr = (formData.get('number') as string | null) || '0';
  const count = Math.max(0, Number(numberStr));
  const existing = await prisma.table.findMany({ where: { label: { startsWith: prefix } }, select: { label: true } });
  const existingSet = new Set(existing.map(t => t.label));
  const data = Array.from({ length: count }, (_, i) => `${prefix} ${i + 1}`)
    .filter(label => !existingSet.has(label))
    .map(label => ({ label }));
  if (data.length > 0) {
    await prisma.table.createMany({ data });
  }
}

// Transactions
export async function listTransactions() {
  return prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: { order: { include: { staff: true } } },
  });
}

// Discounts
export async function listDiscounts() {
  return (prisma as any).discount.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true, items: { include: { menuItem: true } } },
  });
}

export async function createDiscount(formData: FormData) {
  const name = (formData.get('name') as string | null)?.trim() || '';
  const type = (formData.get('type') as string | null) === 'PERCENT' ? 'PERCENT' : 'FIXED';
  const value = Number((formData.get('value') as string | null) || '0');
  const categoryId = (formData.get('categoryId') as string | null) || '';
  const itemIds = formData.getAll('itemIds').map(String).filter(Boolean);
  const startsAtRaw = (formData.get('startsAt') as string | null) || '';
  const endsAtRaw = (formData.get('endsAt') as string | null) || '';
  const startsAt = startsAtRaw ? new Date(startsAtRaw) : null;
  const endsAt = endsAtRaw ? new Date(endsAtRaw) : null;

  if (!name) throw new Error('Name is required');
  if (!categoryId) throw new Error('Category is required');
  if (!(value > 0)) throw new Error('Value must be greater than 0');

  await (prisma as any).discount.create({
    data: {
      name,
      type: type as any,
      value,
      categoryId,
      startsAt: startsAt || undefined,
      endsAt: endsAt || undefined,
      items: {
        create: itemIds.map((menuItemId) => ({ menuItemId })),
      },
    },
  });
}
