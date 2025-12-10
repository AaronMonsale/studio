'use server'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Table as TableIcon } from "lucide-react";
import Link from "next/link";
import { listTables } from "@/lib/admin-actions";

const statusColors = {
    available: 'bg-green-100 border-green-300 text-green-800',
    occupied: 'bg-red-100 border-red-300 text-red-800',
    reserved: 'bg-yellow-100 border-yellow-300 text-yellow-800',
} as const;

const statusText = {
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
} as const;

function TableCard({ id, label, status }: { id: string; label: string; status: 'available' | 'occupied' | 'reserved' }) {
    return (
        <Link href={`/staff/pos/${id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center p-4 aspect-square">
                    <TableIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="font-bold text-lg">{label}</p>
                    <Badge className={cn("mt-2 text-xs", statusColors[status])}>
                        {statusText[status]}
                    </Badge>
                </CardContent>
            </Card>
        </Link>
    );
}

export default async function StaffPage() {
    const tables = await listTables();
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight mb-6">Select a Table</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {tables.map((t: any) => (
                    <TableCard
                        key={t.id}
                        id={t.id}
                        label={t.label}
                        status={(t.status as string).toLowerCase() as 'available' | 'occupied' | 'reserved'}
                    />
                ))}
            </div>
        </div>
    );
}
