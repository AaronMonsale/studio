'use client';
import { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { RevenueData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ChartData = {
    daily: RevenueData[];
    weekly: RevenueData[];
    monthly: RevenueData[];
    annual: RevenueData[];
}

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'annual';

export function RevenueChart(props: ChartData) {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');

    const dataMap = {
        daily: props.daily,
        weekly: props.weekly,
        monthly: props.monthly,
        annual: props.annual,
    };
    
    const activeData = dataMap[timeFrame];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Revenue Analytics</CardTitle>
                    <CardDescription>An overview of revenue performance.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {(Object.keys(dataMap) as TimeFrame[]).map(frame => (
                        <Button 
                            key={frame}
                            variant={timeFrame === frame ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTimeFrame(frame)}
                            className="capitalize"
                        >
                            {frame}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={activeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
