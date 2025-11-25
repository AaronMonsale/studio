import { StatCard } from "@/components/dashboard/stat-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { getAnnualRevenue, getDailyRevenue, getDashboardStats, getMonthlyRevenue, getSalesData, getWeeklyRevenue } from "@/lib/dashboard";
import { DollarSign, Receipt, TrendingUp, Users } from "lucide-react";

export default async function DashboardPage() {
    const [stats, daily, weekly, monthly, annual, sales] = await Promise.all([
        getDashboardStats(),
        getDailyRevenue(),
        getWeeklyRevenue(),
        getMonthlyRevenue(),
        getAnnualRevenue(),
        getSalesData(),
    ]);

    return (
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                description="Total revenue from completed sales"
                Icon={DollarSign}
            />
            <StatCard
                title="Transactions"
                value={`+${stats.totalTransactions.toLocaleString()}`}
                description="Total number of transactions"
                Icon={Receipt}
            />
            <StatCard
                title="Avg. Transaction Value"
                value={`$${stats.avgTransactionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
                    daily={daily}
                    weekly={weekly}
                    monthly={monthly}
                    annual={annual}
                />
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <SalesChart data={sales} />
            </div>
        </div>
    );
}
