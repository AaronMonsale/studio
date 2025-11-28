'use server'
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Ban, CircleDollarSign, Hand, ArrowLeft } from "lucide-react";
import { listMenu, listDiscounts } from "@/lib/admin-actions";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { MenuTilesController } from "@/components/pos/menu-tiles-controller";
import { addItemToOrder, markTableOccupied, reserveTable, cancelReservation, completeOrder, removeItemFromOrder, cancelOrder } from "@/lib/pos-actions";
import { PosActions } from "@/components/pos/pos-actions";
import Link from "next/link";

export default async function PosPage({ params }: { params: Promise<{ tableId: string }> }) {
    const { tableId } = await params;

    // Fetch table info (graceful if not found)
    let tableName = `Table ${tableId}`;
    let tableStatus: 'available' | 'occupied' | 'reserved' = 'available';
    let reservationName: string | null = null;
    try {
        const table = await prisma.table.findUnique({ where: { id: tableId } });
        if (!table) {
            redirect('/staff');
        }
        tableName = table!.label;
        tableStatus = (table!.status as any)?.toString().toLowerCase() as any;
        reservationName = (table as any).reservationName ?? null;
    } catch {
        // If DB is unavailable, still render with fallback name
    }

    // Fetch menu categories and items created by admin
    const categories = await listMenu();

    // Fetch current open order with its items for live sidebar summary
    const openOrder = await prisma.order.findFirst({
        where: { tableId, status: 'OPEN' as any },
        include: {
            items: {
                include: { menuItem: true },
            },
        },
    });

    // Fetch discounts configured on the admin side so staff can apply them in POS
    const rawDiscounts = await listDiscounts();
    const now = new Date();
    const activeDiscounts = (rawDiscounts as any[]).filter((d) => {
        if (!d.active) return false;
        if (d.startsAt && new Date(d.startsAt) > now) return false;
        if (d.endsAt && new Date(d.endsAt) < now) return false;
        return true;
    });
    const serializableDiscounts = activeDiscounts.map((d) => ({
        id: d.id,
        name: d.name as string,
        label: d.type === 'PERCENT'
            ? `${d.name} – ${Number(d.value)}%`
            : `${d.name} – $${Number(d.value).toFixed(2)}`,
    }));
    // Convert Prisma Decimal to plain number so it can be sent to a Client Component
    const serializableCategories = categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        items: (cat.items || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description ?? null,
            price: Number(item.price),
        })),
    }));

    return (
        <div className="grid md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-2 space-y-6">
                {/* Hidden form to add items to order via server action */}
                <form id="add-item-form" action={addItemToOrder} className="hidden">
                    <input type="hidden" name="tableId" defaultValue={tableId} />
                    <input type="hidden" name="menuItemId" />
                    <input type="hidden" name="discountName" />
                </form>
                {categories.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Menu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">No categories yet. Create categories and items in Admin → Menu.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <MenuTilesController
                        categories={serializableCategories as any}
                        tableId={tableId}
                        discounts={serializableDiscounts as any}
                    />
                )}
            </div>
            <div>
                <Card className="sticky top-20">
                    <CardHeader>
                        <div className="mb-2">
                            <Link href="/staff">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Tables
                                </Button>
                            </Link>
                        </div>
                        <CardTitle className="flex justify-between items-center">
                            <span>{tableName}</span>
                            <Badge variant={
                                tableStatus === 'available' ? 'default' : 
                                tableStatus === 'occupied' ? 'destructive' :
                                'secondary'
                            } className="capitalize">{tableStatus}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            {tableStatus === 'reserved' && reservationName && !openOrder ? (
                                <p className="text-center text-muted-foreground">Reserved to {reservationName}</p>
                            ) : null}

                            {!openOrder || openOrder.items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg min-h-[200px]">
                                    <p className="text-center text-muted-foreground">No items in the current order yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="border rounded-lg p-3 max-h-72 overflow-y-auto text-sm">
                                        <div className="flex justify-between font-medium mb-2">
                                            <span>Item</span>
                                            <span>Qty × Price</span>
                                            <span className="text-right">Total</span>
                                        </div>
                                        {(() => {
                                            const grouped: Record<string, { name: string; qty: number; unit: number }> = {};
                                            for (const it of (openOrder.items as any[])) {
                                                const id = it.menuItemId;
                                                const name = it.menuItem?.name || 'Item';
                                                const unit = Number(it.unitPrice);
                                                if (!grouped[id]) {
                                                    grouped[id] = { name, qty: 0, unit };
                                                }
                                                grouped[id].qty += it.quantity ?? 1;
                                            }
                                            const rows = Object.entries(grouped);
                                            return rows.map(([id, row]) => {
                                                const lineTotal = row.unit * row.qty;
                                                return (
                                                    <form
                                                        key={id}
                                                        action={removeItemFromOrder}
                                                        className="flex items-center justify-between py-1 border-b last:border-b-0 gap-2"
                                                    >
                                                        <input type="hidden" name="tableId" value={tableId} />
                                                        <input type="hidden" name="menuItemId" value={id} />
                                                        <span className="truncate pr-2 flex-1">{row.name}</span>
                                                        <span className="text-muted-foreground text-xs whitespace-nowrap">{row.qty} × ${row.unit.toFixed(2)}</span>
                                                        <span className="font-medium text-right w-16">${lineTotal.toFixed(2)}</span>
                                                        <Button type="submit" variant="ghost" size="icon" className="h-6 w-6 text-xs">
                                                            ×
                                                        </Button>
                                                    </form>
                                                );
                                            });
                                        })()}
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-semibold">
                                        <span>Total</span>
                                        <span>${Number(openOrder.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <form action={completeOrder} className="w-full">
                            <input type="hidden" name="tableId" value={tableId} />
                            <Button className="w-full" size="lg">
                                <CircleDollarSign className="mr-2"/>
                                Pay
                            </Button>
                        </form>
                        <form action={cancelOrder} className="w-full">
                            <input type="hidden" name="tableId" value={tableId} />
                            <Button variant="outline" className="w-full" type="submit">
                                Cancel order
                            </Button>
                        </form>
                        {/* Hidden forms bound to server actions */}
                        <form id="mark-occupied-form" action={markTableOccupied} className="hidden">
                            <input type="hidden" name="tableId" value={tableId} />
                        </form>
                        <form id="reserve-table-form" action={reserveTable} className="hidden">
                            <input type="hidden" name="tableId" value={tableId} />
                            <input type="hidden" name="name" />
                        </form>
                        {/* Client control renders the two buttons and submits these forms */}
                        <PosActions tableId={tableId} hasOpenOrder={Boolean(openOrder && openOrder.items.length > 0)} />
                        {tableStatus === 'reserved' && reservationName && (
                            <form action={cancelReservation} className="w-full">
                                <input type="hidden" name="tableId" value={tableId} />
                                <Button variant="destructive" className="w-full">
                                    <Ban className="mr-2"/>
                                    Cancel Reservation
                                </Button>
                            </form>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
