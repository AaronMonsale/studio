import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactions } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
    
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
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">Staff</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map(t => (
                        <TableRow key={t.id}>
                            <TableCell>
                                <div className="font-medium">{t.customerName}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    Invoice #{t.id}
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{t.staffName}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge className="text-xs" variant={t.status === 'Completed' ? 'default' : t.status === 'Pending' ? 'secondary' : 'destructive'}>
                                    {t.status}
                                </Badge>
                            </TableCell>
                             <TableCell className="hidden md:table-cell">
                                {new Date(t.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">${t.amount.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
