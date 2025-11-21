import { StatCard } from "@/components/dashboard/stat-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { dailyRevenue, weeklyRevenue, monthlyRevenue, annualRevenue, salesData, transactions } from "@/lib/data";
import { DollarSign, Receipt, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
    const totalRevenue = transactions.reduce((acc, t) => t.status === 'Completed' ? acc + t.amount : acc, 0);
    const totalTransactions = transactions.length;
    const avgTransactionValue = totalRevenue / transactions.filter(t => t.status === 'Completed').length;

    return (
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Revenue"
                value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                description="Total revenue from completed sales"
                Icon={DollarSign}
            />
            <StatCard
                title="Transactions"
                value={`+${totalTransactions.toLocaleString()}`}
                description="Total number of transactions"
                Icon={Receipt}
            />
            <StatCard
                title="Avg. Transaction Value"
                value={`$${avgTransactionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                description="Average value per transaction"
                Icon={TrendingUp}
            />
             <StatCard
                title="Customers Today"
                value="+214"
                description="Number of unique customers"
                Icon={Users}
            />

            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <RevenueChart 
                    daily={dailyRevenue}
                    weekly={weeklyRevenue}
                    monthly={monthlyRevenue}
                    annual={annualRevenue}
                />
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <SalesChart data={salesData} />
            </div>
        </div>
    );
}
