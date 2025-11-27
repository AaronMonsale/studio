'use server'
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Ban, CircleDollarSign, Hand, ArrowLeft } from "lucide-react";
import { listMenu } from "@/lib/admin-actions";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { MenuTilesController } from "@/components/pos/menu-tiles-controller";
import { addItemToOrder, markTableOccupied, reserveTable, cancelReservation } from "@/lib/pos-actions";
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
                    <MenuTilesController categories={serializableCategories as any} tableId={tableId} />
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
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg min-h-[200px]">
                            {tableStatus === 'reserved' && reservationName ? (
                                <p className="text-center text-muted-foreground">Reserved to {reservationName}</p>
                            ) : (
                                <p className="text-center text-muted-foreground">Current order will be displayed here.</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" size="lg"><CircleDollarSign className="mr-2"/>Pay</Button>
                        {/* Hidden forms bound to server actions */}
                        <form id="mark-occupied-form" action={markTableOccupied} className="hidden">
                            <input type="hidden" name="tableId" value={tableId} />
                        </form>
                        <form id="reserve-table-form" action={reserveTable} className="hidden">
                            <input type="hidden" name="tableId" value={tableId} />
                            <input type="hidden" name="name" />
                        </form>
                        {/* Client control renders the two buttons and submits these forms */}
                        <PosActions tableId={tableId} />
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
