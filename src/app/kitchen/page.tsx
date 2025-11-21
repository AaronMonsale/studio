'use client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kitchenOrders } from "@/lib/data";
import type { Order } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

function OrderCard({ order }: { order: Order }) {
    const timeAgo = formatDistanceToNow(new Date(order.timestamp), { addSuffix: true });

    return (
        <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">Table {order.table}</CardTitle>
                <Badge variant={order.status === 'New' ? 'destructive' : order.status === 'Preparing' ? 'secondary' : 'default'}>{order.status}</Badge>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 py-4 border-t border-b">
                    {order.items.map(item => (
                        <li key={item.name} className="flex justify-between items-center">
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-lg font-bold">x{item.quantity}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-xs text-muted-foreground pt-2 text-right">{timeAgo}</p>
            </CardContent>
        </Card>
    );
}

export default function KitchenPage() {
    const ordersNew = kitchenOrders.filter(o => o.status === 'New').sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const ordersPreparing = kitchenOrders.filter(o => o.status === 'Preparing').sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const ordersReady = kitchenOrders.filter(o => o.status === 'Ready').sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <div className="space-y-4 p-2 rounded-lg bg-red-500/10">
                <h2 className="text-lg font-bold text-center text-red-700">New ({ordersNew.length})</h2>
                {ordersNew.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
            <div className="space-y-4 p-2 rounded-lg bg-yellow-500/10">
                <h2 className="text-lg font-bold text-center text-yellow-700">Preparing ({ordersPreparing.length})</h2>
                {ordersPreparing.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
            <div className="space-y-4 p-2 rounded-lg bg-green-500/10">
                <h2 className="text-lg font-bold text-center text-green-700">Ready ({ordersReady.length})</h2>
                {ordersReady.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
        </div>
    );
}
