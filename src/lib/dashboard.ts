"use server";

import prisma from "@/lib/db";
import { PaymentStatus } from "@prisma/client";

export type RevenuePoint = { name: string; revenue: number };
export type SalesPoint = { name: string; total: number };

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function formatHourLabel(d: Date) {
  return `${d.getHours()}:00`;
}

function formatDateLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatMonthLabel(idx: number) {
  return new Date(2000, idx, 1).toLocaleString(undefined, { month: "short" });
}

export async function getDashboardStats() {
  try {
    const [txCount, txAgg] = await Promise.all([
      prisma.transaction.count({ where: { status: PaymentStatus.SUCCESS } }),
      prisma.transaction.aggregate({
        where: { status: PaymentStatus.SUCCESS },
        _sum: { amount: true },
      }),
    ]);

    const totalRevenue = Number(txAgg._sum.amount || 0);
    const totalTransactions = txCount;
    const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return { totalRevenue, totalTransactions, avgTransactionValue };
  } catch {
    return { totalRevenue: 0, totalTransactions: 0, avgTransactionValue: 0 };
  }
}

export async function getOrdersToday(): Promise<number> {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  try {
    const count = await prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } });
    return count;
  } catch {
    return 0;
  }
}

export async function getTableOccupancy(): Promise<{ available: number; occupied: number; reserved: number }> {
  try {
    const [available, occupied, reserved] = await Promise.all([
      prisma.table.count({ where: { status: "AVAILABLE" } as any }),
      prisma.table.count({ where: { status: "OCCUPIED" } as any }),
      prisma.table.count({ where: { status: "RESERVED" } as any }),
    ]);
    return { available, occupied, reserved };
  } catch {
    return { available: 0, occupied: 0, reserved: 0 };
  }
}

export async function getDailyRevenue(): Promise<RevenuePoint[]> {
  // Last 24 hours buckets by hour
  const now = new Date();
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  let tx: { amount: any; createdAt: Date }[] = [];
  try {
    tx = await prisma.transaction.findMany({
      where: { status: PaymentStatus.SUCCESS, createdAt: { gte: start } },
      select: { amount: true, createdAt: true },
    });
  } catch {
    tx = [];
  }
  const buckets: Record<string, number> = {};
  for (let i = 0; i < 24; i++) {
    const h = new Date(start.getTime() + i * 60 * 60 * 1000);
    buckets[h.getHours().toString()] = 0;
  }
  tx.forEach((t) => {
    const h = t.createdAt.getHours().toString();
    buckets[h] = (buckets[h] || 0) + Number(t.amount);
  });
  const points: RevenuePoint[] = [];
  for (let i = 0; i < 24; i++) {
    const h = new Date(start.getTime() + i * 60 * 60 * 1000);
    points.push({ name: formatHourLabel(h), revenue: buckets[h.getHours().toString()] || 0 });
  }
  return points;
}

export async function getWeeklyRevenue(): Promise<RevenuePoint[]> {
  // Last 7 days
  const today = startOfDay(new Date());
  const start = addDays(today, -6);
  let tx: { amount: any; createdAt: Date }[] = [];
  try {
    tx = await prisma.transaction.findMany({
      where: { status: PaymentStatus.SUCCESS, createdAt: { gte: start } },
      select: { amount: true, createdAt: true },
    });
  } catch {
    tx = [];
  }
  const buckets: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    buckets[startOfDay(d).toISOString()] = 0;
  }
  tx.forEach((t) => {
    const key = startOfDay(t.createdAt).toISOString();
    buckets[key] = (buckets[key] || 0) + Number(t.amount);
  });
  const points: RevenuePoint[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    const key = startOfDay(d).toISOString();
    points.push({ name: d.toLocaleDateString(undefined, { weekday: "short" }), revenue: buckets[key] || 0 });
  }
  return points;
}

export async function getMonthlyRevenue(): Promise<RevenuePoint[]> {
  // Last 30 days
  const today = startOfDay(new Date());
  const start = addDays(today, -29);
  let tx: { amount: any; createdAt: Date }[] = [];
  try {
    tx = await prisma.transaction.findMany({
      where: { status: PaymentStatus.SUCCESS, createdAt: { gte: start } },
      select: { amount: true, createdAt: true },
    });
  } catch {
    tx = [];
  }
  const buckets: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = addDays(start, i);
    buckets[startOfDay(d).toISOString()] = 0;
  }
  tx.forEach((t) => {
    const key = startOfDay(t.createdAt).toISOString();
    buckets[key] = (buckets[key] || 0) + Number(t.amount);
  });
  const points: RevenuePoint[] = [];
  for (let i = 0; i < 30; i++) {
    const d = addDays(start, i);
    const key = startOfDay(d).toISOString();
    points.push({ name: formatDateLabel(d), revenue: buckets[key] || 0 });
  }
  return points;
}

export async function getAnnualRevenue(): Promise<RevenuePoint[]> {
  // Current year by month
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);
  let tx: { amount: any; createdAt: Date }[] = [];
  try {
    tx = await prisma.transaction.findMany({
      where: { status: PaymentStatus.SUCCESS, createdAt: { gte: yearStart, lt: nextYear } },
      select: { amount: true, createdAt: true },
    });
  } catch {
    tx = [];
  }
  const buckets: number[] = Array.from({ length: 12 }, () => 0);
  tx.forEach((t) => {
    const m = t.createdAt.getMonth();
    buckets[m] += Number(t.amount);
  });
  const points: RevenuePoint[] = buckets.map((v, i) => ({ name: formatMonthLabel(i), revenue: v }));
  return points;
}

export async function getSalesData(): Promise<SalesPoint[]> {
  // Use orders (paid) as sales counts, grouped last 7 days
  const today = startOfDay(new Date());
  const start = addDays(today, -6);
  let orders: { createdAt: Date }[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true },
    });
  } catch {
    orders = [];
  }
  const buckets: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    buckets[startOfDay(d).toISOString()] = 0;
  }
  orders.forEach((o) => {
    const key = startOfDay(o.createdAt).toISOString();
    buckets[key] = (buckets[key] || 0) + 1;
  });
  const points: SalesPoint[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    const key = startOfDay(d).toISOString();
    points.push({ name: d.toLocaleDateString(undefined, { weekday: "short" }), total: buckets[key] || 0 });
  }
  return points;
}
