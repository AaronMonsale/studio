import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listTransactions } from "@/lib/admin-actions";
import { PaymentStatus } from "@prisma/client";
import Link from "next/link";

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

export default async function TransactionsPage() {
  const transactions = await listTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground">A detailed record of all transactions.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            A list of all recent transactions processed through the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead className="hidden sm:table-cell">Staff</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id} className="cursor-pointer hover:bg-muted/60">
                  <TableCell>
                    <Link href={`/admin/transactions/${t.id}`} className="block">
                      <div className="font-medium">Invoice #{t.orderId}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        Tx #{t.id}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{t.order?.staff?.name || '—'}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs" variant={statusBadgeVariant(t.status)}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">${Number(t.amount).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
