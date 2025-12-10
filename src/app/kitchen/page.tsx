import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { Ban, Check } from "lucide-react";
import { KitchenStatus } from "@prisma/client";
import { acceptKitchenOrder, cancelKitchenOrder, markKitchenOrderReady } from "@/lib/kitchen-actions";

type KitchenOrder = {
  id: string;
  tableLabel: string;
  items: { name: string; quantity: number }[];
  status: 'New' | 'Preparing' | 'Ready';
  timestamp: string;
};

function OrderCard({ order }: { order: KitchenOrder }) {
    const timeAgo = formatDistanceToNow(new Date(order.timestamp), { addSuffix: true });

    return (
        <Card className="w-full shadow-md hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">{order.tableLabel}</CardTitle>
                <Badge variant={order.status === 'New' ? 'destructive' : order.status === 'Preparing' ? 'secondary' : 'default'}>{order.status}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
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
            <CardFooter className="flex gap-2">
                {order.status === 'New' && (
                    <>
                        <form action={cancelKitchenOrder} className="w-full">
                            <input type="hidden" name="orderId" value={order.id} />
                            <Button variant="destructive" size="sm" className="w-full">
                                <Ban className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </form>
                        <form action={acceptKitchenOrder} className="w-full">
                            <input type="hidden" name="orderId" value={order.id} />
                            <Button size="sm" className="w-full">
                                Accept Order
                            </Button>
                        </form>
                    </>
                )}
                {order.status === 'Preparing' && (
                    <form action={markKitchenOrderReady} className="w-full">
                        <input type="hidden" name="orderId" value={order.id} />
                        <Button size="sm" className="w-full">
                            <Check className="mr-2 h-4 w-4" />
                            Done
                        </Button>
                    </form>
                )}
            </CardFooter>
        </Card>
    );
}

export default async function KitchenPage() {
    // Fetch all open orders with their tables and items
    const orders = await prisma.order.findMany({
        where: { status: 'OPEN' as any },
        include: {
            table: true,
            items: {
                include: { menuItem: true },
            },
        },
        orderBy: { createdAt: 'asc' },
    });
    const now = new Date();

    const kitchenOrders: KitchenOrder[] = orders
        .filter((o) => o.kitchenStatus !== KitchenStatus.CANCELLED)
        .map((o) => ({
            id: o.id,
            tableLabel: o.table?.label ? `Table ${o.table.label}` : 'Unknown table',
            items: o.items.map((it) => ({
                name: it.menuItem?.name || 'Item',
                quantity: it.quantity ?? 1,
            })),
            status:
                o.kitchenStatus === KitchenStatus.PREPARING
                    ? 'Preparing'
                    : o.kitchenStatus === KitchenStatus.READY
                    ? 'Ready'
                    : 'New',
            // Use kitchenUpdatedAt so we can time out "Ready" orders
            timestamp: o.kitchenUpdatedAt.toISOString(),
        }));

    const ordersNew = kitchenOrders
        .filter((o) => o.status === 'New')
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const ordersPreparing = kitchenOrders
        .filter((o) => o.status === 'Preparing')
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const twoMinutesMs = 2 * 60 * 1000;
    const ordersReady = kitchenOrders
        .filter((o) => o.status === 'Ready' && now.getTime() - new Date(o.timestamp).getTime() < twoMinutesMs)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
