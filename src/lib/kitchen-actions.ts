'use server';

import prisma from '@/lib/db';
import { KitchenStatus, OrderStatus } from '@prisma/client';

export async function acceptKitchenOrder(formData: FormData) {
  const orderId = (formData.get('orderId') as string | null) || '';
  if (!orderId) return;

  await prisma.order.update({
    where: { id: orderId, status: OrderStatus.OPEN },
    data: {
      kitchenStatus: KitchenStatus.PREPARING,
      kitchenUpdatedAt: new Date(),
    },
  });
}

export async function markKitchenOrderReady(formData: FormData) {
  const orderId = (formData.get('orderId') as string | null) || '';
  if (!orderId) return;

  await prisma.order.update({
    where: { id: orderId, status: OrderStatus.OPEN },
    data: {
      kitchenStatus: KitchenStatus.READY,
      kitchenUpdatedAt: new Date(),
    },
  });
}

export async function cancelKitchenOrder(formData: FormData) {
  const orderId = (formData.get('orderId') as string | null) || '';
  if (!orderId) return;

  // Keep the order record (for billing/history), but remove it from the kitchen queue.
  await prisma.order.update({
    where: { id: orderId, status: OrderStatus.OPEN },
    data: {
      kitchenStatus: KitchenStatus.CANCELLED,
      kitchenUpdatedAt: new Date(),
    },
  });
}
