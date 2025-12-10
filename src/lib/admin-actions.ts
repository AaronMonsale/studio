'use server';

import prisma from '@/lib/db';
import { UserRole, PaymentStatus } from '@prisma/client';

// Employees
export async function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function updateTable(formData: FormData) {
  const id = (formData.get('id') as string | null) || '';
  const label = (formData.get('label') as string | null)?.trim() || '';
  const capacityStr = (formData.get('capacity') as string | null) || '';
  const status = (formData.get('status') as string | null) || undefined;
  if (!id) throw new Error('Table ID is required');
  if (!label) throw new Error('Table label is required');
  const data: any = { label };
  if (capacityStr !== '') data.capacity = Math.max(1, Number(capacityStr));
  if (status === 'AVAILABLE' || status === 'OCCUPIED' || status === 'RESERVED') data.status = status as any;
  await prisma.table.update({ where: { id }, data });
}

export async function deleteTable(formData: FormData) {
  const id = (formData.get('id') as string | null) || '';
  if (!id) throw new Error('Table ID is required');
  // Detach orders referencing this table
  await prisma.order.updateMany({ where: { tableId: id }, data: { tableId: null } });
  await prisma.table.delete({ where: { id } });
}

export async function updateDiscount(formData: FormData) {
  const id = (formData.get('id') as string | null) || '';
  if (!id) throw new Error('Discount ID is required');

  const name = (formData.get('name') as string | null)?.trim() || '';
  const typeRaw = (formData.get('type') as string | null) || '';
  const valueStr = (formData.get('value') as string | null) || '';
  const categoryId = (formData.get('categoryId') as string | null) || undefined;
  const startsAtRaw = (formData.get('startsAt') as string | null) || '';
  const endsAtRaw = (formData.get('endsAt') as string | null) || '';
  const activeStr = (formData.get('active') as string | null) || '';

  if (!name) throw new Error('Name is required');
  const data: any = { name };
  if (typeRaw === 'PERCENT' || typeRaw === 'FIXED') data.type = typeRaw as any;
  if (valueStr !== '') data.value = Number(valueStr);
  if (categoryId) data.categoryId = categoryId;
  if (startsAtRaw) data.startsAt = new Date(startsAtRaw);
  else if (startsAtRaw === '') data.startsAt = null;
  if (endsAtRaw) data.endsAt = new Date(endsAtRaw);
  else if (endsAtRaw === '') data.endsAt = null;
  if (activeStr !== '') data.active = activeStr === 'true' || activeStr === 'on' || activeStr === '1';

  await (prisma as any).discount.update({ where: { id }, data });
}

export async function deleteDiscount(formData: FormData) {
  const id = (formData.get('id') as string | null) || '';
  if (!id) throw new Error('Discount ID is required');
  await (prisma as any).discount.delete({ where: { id } });
}

export async function updateCategory(formData: FormData) {
  const categoryId = (formData.get('categoryId') as string | null) || '';
  const name = (formData.get('name') as string | null)?.trim() || '';
  if (!categoryId) throw new Error('Category ID is required');
  if (!name) throw new Error('Category name is required');
  await prisma.menuCategory.update({ where: { id: categoryId }, data: { name } });
}

export async function updateMenuItem(formData: FormData) {
  const itemId = (formData.get('itemId') as string | null) || '';
  const name = (formData.get('name') as string | null)?.trim() || '';
  const description = (formData.get('description') as string | null) || null;
  const priceStr = (formData.get('price') as string | null) || '';
  if (!itemId) throw new Error('Item ID is required');
  if (!name) throw new Error('Item name is required');
  const data: any = { name };
  if (priceStr !== '') data.price = Number(priceStr);
  if (description !== null) data.description = description || undefined;
  await prisma.menuItem.update({ where: { id: itemId }, data });
}

// Delete a user (admin action)
export async function deleteUser(formData: FormData) {
  const userId = (formData.get('userId') as string | null) || '';
  if (!userId) throw new Error('User ID is required');

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user) return;
  if (user.role === UserRole.ADMIN) {
    throw new Error('Cannot delete an admin user');
  }

  // Detach relations that would block deletion (e.g., orders referencing staffId)
  await prisma.order.updateMany({ where: { staffId: userId }, data: { staffId: null } });

  // Sessions have onDelete: Cascade in schema, so they will be removed automatically
  await prisma.user.delete({ where: { id: userId } });
}

export async function createUser(formData: FormData) {
  const name = (formData.get('name') as string | null)?.trim() || '';
  const roleStr = (formData.get('role') as string | null) || 'STAFF';
  const emailRaw = (formData.get('email') as string | null)?.trim().toLowerCase() || '';
  const password = (formData.get('password') as string | null) || '';
  const pin = (formData.get('pin') as string | null)?.trim() || '';
  const role = (['STAFF', 'KITCHEN'] as const).includes(roleStr as any) ? (roleStr as UserRole) : UserRole.STAFF;

  // STAFF: name + pin (4-6 digits ideal). No password required.
  // KITCHEN: name + password. No pin required.
  if (role === UserRole.STAFF) {
    if (!name) throw new Error('Name is required');
    if (!pin) throw new Error('PIN is required for staff');
    if (!/^\d{4}$/.test(pin)) throw new Error('PIN must be exactly 4 digits');
    const data: any = {
      name,
      role: UserRole.STAFF,
      pin,
    };
    if (emailRaw) {
      data.email = emailRaw;
    } else {
      // Temporary compatibility: some environments still have email as NOT NULL.
      // Provide a deterministic placeholder to satisfy DB constraint until schema is migrated.
      const base = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'staff';
      data.email = `${base}.${Math.random().toString(36).slice(2, 6)}@local.invalid`;
    }
    await prisma.user.create({ data });
  } else {
    if (!password) throw new Error('Password is required for kitchen');
    const effectiveName = name || 'Kitchen';
    const data: any = {
      name: effectiveName,
      role: UserRole.KITCHEN,
      password,
    };
    if (emailRaw) data.email = emailRaw;
    await prisma.user.create({ data });
  }
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

export async function deleteMenuItem(formData: FormData) {
  const itemId = (formData.get('itemId') as string | null) || '';
  if (!itemId) throw new Error('Item ID is required');

  // Remove dependent order items first to satisfy FK constraints
  await prisma.orderItem.deleteMany({ where: { menuItemId: itemId } });
  // DiscountItem has onDelete: Cascade for menuItem relation in schema

  await prisma.menuItem.delete({ where: { id: itemId } });
}

export async function deleteCategory(formData: FormData) {
  const categoryId = (formData.get('categoryId') as string | null) || '';
  if (!categoryId) throw new Error('Category ID is required');

  // Get all items in this category
  const items = await prisma.menuItem.findMany({ where: { categoryId }, select: { id: true } });
  const itemIds = items.map(i => i.id);

  if (itemIds.length > 0) {
    // Remove dependent order items for all items in this category
    await prisma.orderItem.deleteMany({ where: { menuItemId: { in: itemIds } } });
    // Delete menu items
    await prisma.menuItem.deleteMany({ where: { id: { in: itemIds } } });
  }

  // Delete discounts under this category (DiscountItem rows cascade)
  await prisma.discount.deleteMany({ where: { categoryId } as any });

  // Finally delete the category
  await prisma.menuCategory.delete({ where: { id: categoryId } });
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
  const desiredTotal = Math.max(0, Number(numberStr));

  // Find all existing tables with this prefix
  const existing = await prisma.table.findMany({
    where: { label: { startsWith: prefix } },
    select: { label: true },
  });

  // If we already have enough tables with this prefix, nothing to do
  if (existing.length >= desiredTotal) {
    return;
  }

  // Parse numeric suffixes from existing labels like `${prefix} 1`, `${prefix} 2`, etc.
  const usedNumbers = new Set<number>();
  for (const t of existing) {
    const match = t.label.replace(prefix, '').match(/(\d+)\s*$/);
    if (match) {
      usedNumbers.add(Number(match[1]));
    }
  }

  const needed = desiredTotal - existing.length;
  const newLabels: { label: string }[] = [];
  let candidate = 1;
  while (newLabels.length < needed) {
    if (!usedNumbers.has(candidate)) {
      newLabels.push({ label: `${prefix} ${candidate}` });
    }
    candidate++;
  }

  if (newLabels.length > 0) {
    await prisma.table.createMany({ data: newLabels });
  }
}

// Transactions
export async function listTransactions() {
  return prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: { order: { include: { staff: true } } },
  });
}

export async function getTransactionDetails(id: string) {
  if (!id) throw new Error('Transaction ID is required');
  return prisma.transaction.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          staff: true,
          table: true,
          items: {
            include: { menuItem: true },
          },
        },
      },
    },
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
