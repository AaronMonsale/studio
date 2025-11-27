'use server';

import prisma from '@/lib/db';
import { DiscountType, OrderStatus, TableStatus } from '@prisma/client';

function isDiscountActive(d: { startsAt: Date | null; endsAt: Date | null; active: boolean }) {
  const now = new Date();
  if (!d.active) return false;
  if (d.startsAt && now < d.startsAt) return false;
  if (d.endsAt && now > d.endsAt) return false;
  return true;
}

export async function addItemToOrder(formData: FormData) {
  const tableId = (formData.get('tableId') as string | null) || '';
  const menuItemId = (formData.get('menuItemId') as string | null) || '';
  const discountNameRaw = (formData.get('discountName') as string | null) || '';
  if (!tableId || !menuItemId) return;

  // Ensure table exists to satisfy FK constraint
  const table = await prisma.table.findUnique({ where: { id: tableId } });
  if (!table) return;

  // Find or create open order for this table
  let order = await prisma.order.findFirst({ where: { tableId, status: OrderStatus.OPEN } });
  if (!order) {
    order = await prisma.order.create({ data: { tableId, status: OrderStatus.OPEN, total: 0 } });
  }

  const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
  if (!item) return;

  // Find optional discount
  let appliedUnit = item.price as any;
  if (discountNameRaw) {
    const discount = await prisma.discount.findFirst({ where: { name: discountNameRaw } });
    if (discount && isDiscountActive({ startsAt: discount.startsAt, endsAt: discount.endsAt, active: discount.active })) {
      if (discount.type === DiscountType.PERCENT) {
        // appliedUnit = item.price * (1 - value/100)
        appliedUnit = (item.price as any) * (1 - Number(discount.value) / 100);
      } else {
        // FIXED
        appliedUnit = Math.max(0, Number(item.price) - Number(discount.value));
      }
    }
  } else {
    // If no discount name provided, try to find an applicable discount by item or category
    const discounts = await prisma.discount.findMany({
      where: {
        active: true,
        OR: [
          { items: { some: { menuItemId } } },
          { categoryId: item.categoryId || undefined },
        ],
      },
      include: { items: true },
    });
    // pick the best (max savings)
    let bestPrice = Number(item.price);
    for (const d of discounts) {
      if (!isDiscountActive({ startsAt: d.startsAt, endsAt: d.endsAt, active: d.active })) continue;
      let price = Number(item.price);
      if (d.type === DiscountType.PERCENT) price = price * (1 - Number(d.value) / 100);
      else price = Math.max(0, price - Number(d.value));
      if (price < bestPrice) bestPrice = price;
    }
    appliedUnit = bestPrice;
  }

  // Create order item
  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      menuItemId,
      quantity: 1,
      unitPrice: Number(appliedUnit),
    },
  });

  // Recalculate order total
  const all = await prisma.orderItem.findMany({ where: { orderId: order.id }, select: { unitPrice: true, quantity: true } });
  const total = all.reduce((sum, it) => sum + Number(it.unitPrice) * it.quantity, 0);
  await prisma.order.update({ where: { id: order.id }, data: { total } });
}

export async function markTableOccupied(formData: FormData) {
  const tableId = (formData.get('tableId') as string | null) || '';
  if (!tableId) return;
  // Ensure table exists
  const table = await prisma.table.findUnique({ where: { id: tableId } });
  if (!table) return;
  await prisma.table.update({ where: { id: tableId }, data: ({ status: TableStatus.OCCUPIED, reservationName: null } as any) });
}

export async function reserveTable(formData: FormData) {
  const tableId = (formData.get('tableId') as string | null) || '';
  const name = (formData.get('name') as string | null)?.trim() || '';
  if (!tableId || !name) return;
  await prisma.table.update({ where: { id: tableId }, data: ({ status: TableStatus.RESERVED, reservationName: name } as any) });
}

export async function cancelReservation(formData: FormData) {
  const tableId = (formData.get('tableId') as string | null) || '';
  if (!tableId) return;
  await prisma.table.update({ where: { id: tableId }, data: ({ status: TableStatus.AVAILABLE, reservationName: null } as any) });
}
