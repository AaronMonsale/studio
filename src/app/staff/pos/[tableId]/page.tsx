'use server'
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Ban, CircleDollarSign, Hand } from "lucide-react";
import { listMenu } from "@/lib/admin-actions";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { MenuTiles } from "@/components/pos/menu-tiles";

export default async function PosPage({ params }: { params: Promise<{ tableId: string }> }) {
    const { tableId } = await params;

    // Fetch table info (graceful if not found)
    let tableName = `Table ${tableId}`;
    let tableStatus: 'available' | 'occupied' | 'reserved' = 'available';
    try {
        const table = await prisma.table.findUnique({ where: { id: tableId } });
        if (!table) {
            redirect('/staff');
        }
        tableName = table!.label;
        tableStatus = (table!.status as any)?.toString().toLowerCase() as any;
    } catch {
        // If DB is unavailable, still render with fallback name
    }

    // Fetch menu categories and items created by admin
    const categories = await listMenu();

    return (
        <div className="grid md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-2 space-y-6">
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
                    <MenuTiles categories={categories as any} />
                )}
            </div>
            <div>
                <Card className="sticky top-20">
                    <CardHeader>
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
                            <p className="text-center text-muted-foreground">Current order will be displayed here.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" size="lg"><CircleDollarSign className="mr-2"/>Pay</Button>
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <Button variant="outline"><Hand className="mr-2"/>Occupied</Button>
                            <Button variant="outline">Reserved</Button>
                        </div>
                        <Button variant="destructive" className="w-full"><Ban className="mr-2"/>Cancel</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
