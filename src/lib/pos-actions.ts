'use server';

import prisma from '@/lib/db';
import { DiscountType, OrderStatus, PaymentMethod, PaymentStatus, TableStatus } from '@prisma/client';
import { getSession } from '@/lib/actions';
import { redirect } from 'next/navigation';

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
    // Attach current staff user if available
    let staffId: string | null = null;
    try {
      const session = await getSession();
      if (session?.userType === 'staff' && session.id) staffId = session.id;
    } catch {}

    order = await prisma.order.create({
      data: {
        tableId,
        status: OrderStatus.OPEN,
        total: 0,
        staffId: staffId || undefined,
      },
    });
  }

  const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
  if (!item) return;

  // Find optional discount
  let appliedUnit = item.price as any;
  let appliedDiscountName: string | null = null;
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
      appliedDiscountName = discount.name;
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
    let bestDiscountName: string | null = null;
    for (const d of discounts) {
      if (!isDiscountActive({ startsAt: d.startsAt, endsAt: d.endsAt, active: d.active })) continue;
      let price = Number(item.price);
      if (d.type === DiscountType.PERCENT) price = price * (1 - Number(d.value) / 100);
      else price = Math.max(0, price - Number(d.value));
      if (price < bestPrice) {
        bestPrice = price;
        bestDiscountName = d.name;
      }
    }
    appliedUnit = bestPrice;
    appliedDiscountName = bestDiscountName;
  }

  // If an item with the same menuItemId already exists on this order,
  // increment its quantity instead of creating a new line.
  const existing = await prisma.orderItem.findFirst({
    where: {
      orderId: order.id,
      menuItemId,
    },
  });

  if (existing) {
    await prisma.orderItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + 1,
      },
    });
  } else {
    // Create order item
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId,
        quantity: 1,
        unitPrice: Number(appliedUnit),
        appliedDiscountName: appliedDiscountName || undefined,
      },
    });
  }

  // Recalculate order total
  const all = await prisma.orderItem.findMany({ where: { orderId: order.id }, select: { unitPrice: true, quantity: true } });
  const total = all.reduce((sum, it) => sum + Number(it.unitPrice) * it.quantity, 0);
  await prisma.order.update({ where: { id: order.id }, data: { total } });
}

export async function applyDiscountToOrderItem(params: { orderItemId: string; discountName: string | null }) {
  const { orderItemId, discountName } = params;
  if (!orderItemId) return;

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      order: true,
      menuItem: true,
    },
  });
  if (!orderItem || !orderItem.order || !orderItem.menuItem) return;

  const basePrice = Number(orderItem.menuItem.price);
  let newUnit = basePrice;
  let appliedDiscountName: string | null = null;

  if (discountName) {
    const discount = await prisma.discount.findFirst({ where: { name: discountName } });
    if (discount && isDiscountActive({ startsAt: discount.startsAt, endsAt: discount.endsAt, active: discount.active })) {
      if (discount.type === DiscountType.PERCENT) {
        newUnit = basePrice * (1 - Number(discount.value) / 100);
      } else {
        newUnit = Math.max(0, basePrice - Number(discount.value));
      }
      appliedDiscountName = discount.name;
    }
  }

  await prisma.orderItem.update({
    where: { id: orderItem.id },
    data: {
      unitPrice: newUnit,
      appliedDiscountName: appliedDiscountName || undefined,
    },
  });

  const all = await prisma.orderItem.findMany({
    where: { orderId: orderItem.orderId },
    select: { unitPrice: true, quantity: true },
  });
  const total = all.reduce((sum, it) => sum + Number(it.unitPrice) * it.quantity, 0);
  await prisma.order.update({ where: { id: orderItem.orderId }, data: { total } });
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
  redirect(`/staff/pos/${tableId}`);
}

export async function cancelReservation(formData: FormData) {
  const tableId = (formData.get('tableId') as string | null) || '';
  if (!tableId) return;
  await prisma.table.update({ where: { id: tableId }, data: ({ status: TableStatus.AVAILABLE, reservationName: null } as any) });
  redirect(`/staff/pos/${tableId}`);
}

export async function completeOrder(formData: FormData) {
  const tableId = (formData.get('tableId') as string | null) || '';
  if (!tableId) return;

  // Find open order for this table
  const order = await prisma.order.findFirst({
    where: { tableId, status: OrderStatus.OPEN },
    include: { items: true },
  });
  if (!order) return;

  // Ensure staff association if available
  try {
    const session = await getSession();
    if (session?.userType === 'staff' && session.id && order.staffId == null) {
      await prisma.order.update({ where: { id: order.id }, data: { staffId: session.id } });
    }
  } catch {}

  // Use the current order total as transaction amount
  const amount = Number(order.total);

  // Create transaction record
  await prisma.transaction.create({
    data: {
      orderId: order.id,
      amount,
      method: PaymentMethod.CASH,
      status: PaymentStatus.SUCCESS,
    },
  });

  // Mark order as paid and free the table
  await prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.PAID } });
  await prisma.table.update({
    where: { id: tableId },
    data: ({ status: TableStatus.AVAILABLE, reservationName: null } as any),
  });
}

export async function removeItemFromOrder(formData: FormData) {
  const tableId = (formData.get('tableId') as string | null) || '';
  const menuItemId = (formData.get('menuItemId') as string | null) || '';
  if (!tableId || !menuItemId) return;

  const order = await prisma.order.findFirst({ where: { tableId, status: OrderStatus.OPEN } });
  if (!order) return;

  const item = await prisma.orderItem.findFirst({
    where: { orderId: order.id, menuItemId },
  });
  if (!item) return;

  await prisma.orderItem.delete({ where: { id: item.id } });

  const remaining = await prisma.orderItem.findMany({
    where: { orderId: order.id },
    select: { unitPrice: true, quantity: true },
  });
  const total = remaining.reduce((sum, it) => sum + Number(it.unitPrice) * it.quantity, 0);
  await prisma.order.update({ where: { id: order.id }, data: { total } });
  redirect(`/staff/pos/${tableId}`);
}

export async function cancelOrder(formData: FormData) {
  const tableId = (formData.get('tableId') as string | null) || '';
  if (!tableId) return;

  const order = await prisma.order.findFirst({ where: { tableId, status: OrderStatus.OPEN } });
  if (!order) return;

  await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
  await prisma.order.delete({ where: { id: order.id } });

  await prisma.table.update({
    where: { id: tableId },
    data: ({ status: TableStatus.AVAILABLE, reservationName: null } as any),
  });
  redirect(`/staff/pos/${tableId}`);
}
