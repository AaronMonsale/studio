'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSalesReportInsights } from '@/ai/flows/generate-sales-report-insights';
import { Wand2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function SalesInsights() {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setInsights('');
    try {
      const result = await generateSalesReportInsights({});
      setInsights(result.insights);
    } catch (e) {
      setError('Failed to generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>AI-Powered Sales Insights</CardTitle>
        <CardDescription>Generate insights and trends from your sales data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerate} disabled={loading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? 'Generating...' : 'Generate Sales Report'}
        </Button>

        {loading && (
            <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {insights && (
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-secondary/50 p-4">
            <p>{insights}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
