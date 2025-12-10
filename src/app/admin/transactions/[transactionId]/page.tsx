"use server";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTransactionDetails } from "@/lib/admin-actions";
import { PaymentStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function statusBadgeVariant(status: PaymentStatus) {
  switch (status) {
    case "SUCCESS":
      return "default" as const;
    case "PENDING":
      return "secondary" as const;
    case "FAILED":
    default:
      return "destructive" as const;
  }
}

export default async function TransactionDetailsPage({ params }: { params: Promise<{ transactionId: string }> }) {
  const { transactionId } = await params;
  const tx = await getTransactionDetails(transactionId);

  if (!tx || !tx.order) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Transaction not found</CardTitle>
            <CardDescription>The requested transaction could not be located.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/transactions">
              <Button variant="outline">Back to Transactions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const order = tx.order;
  const staffName = order.staff?.name || "—";
  const tableLabel = order.table?.label || "—";
  const createdAt = new Date(tx.createdAt);
  const items = order.items || [];

  const uniqueDiscounts = Array.from(
    new Set(
      items
        .map((it: any) => it.appliedDiscountName)
        .filter(Boolean)
    )
  ) as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Transaction Details</h1>
          <p className="text-muted-foreground">Invoice #{order.id}</p>
        </div>
        <Link href="/admin/transactions">
          <Button variant="outline">Back to Transactions</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Overview of this transaction.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 text-sm">
            <div>
              <div className="text-muted-foreground">Transaction ID</div>
              <div className="font-medium break-all">{tx.id}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Staff</div>
              <div className="font-medium">{staffName}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Table</div>
              <div className="font-medium">{tableLabel}</div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="text-muted-foreground">Status</div>
              <Badge className="text-xs" variant={statusBadgeVariant(tx.status)}>
                {tx.status}
              </Badge>
            </div>
            <div>
              <div className="text-muted-foreground">Date &amp; time</div>
              <div className="font-medium">{createdAt.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Total amount</div>
              <div className="font-medium">${Number(tx.amount).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Payment method</div>
              <div className="font-medium">{tx.method}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Applied discounts</div>
              <div className="font-medium">
                {uniqueDiscounts.length > 0 ? uniqueDiscounts.join(", ") : "None"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>Line items included in this transaction.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="hidden sm:table-cell">Discount</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Line total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it: any) => {
                const name = it.menuItem?.name || "Item";
                const qty = it.quantity ?? 1;
                const unit = Number(it.unitPrice);
                const lineTotal = unit * qty;
                return (
                  <TableRow key={it.id}>
                    <TableCell>{name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {it.appliedDiscountName ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">{qty}</TableCell>
                    <TableCell className="text-right">${unit.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${lineTotal.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No items recorded on this order.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
