'use client'
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { initialTables } from "@/lib/data";
import { Ban, CircleDollarSign, Hand, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PosPage({ params }: { params: { tableId: string } }) {
    const router = useRouter();
    const table = initialTables.find(t => t.id === params.tableId);

    React.useEffect(() => {
        if (!table) {
            router.push('/staff');
        }
    }, [table, router]);

    if (!table) {
        // Render a loading state or null while redirecting
        return null; 
    }

    return (
        <div className="grid md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Menu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                            <Utensils className="h-16 w-16 text-muted-foreground" />
                            <p className="mt-4 text-center text-muted-foreground">Menu items will be displayed here.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card className="sticky top-20">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{table.name}</span>
                            <Badge variant={
                                table.status === 'available' ? 'default' : 
                                table.status === 'occupied' ? 'destructive' :
                                'secondary'
                            } className="capitalize">{table.status}</Badge>
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
