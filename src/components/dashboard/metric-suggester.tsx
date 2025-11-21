'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestDashboardMetrics } from '@/ai/flows/suggest-dashboard-metrics';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

export function MetricSuggester() {
  const [metrics, setMetrics] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setMetrics([]);
    setReasoning('');

    try {
      const result = await suggestDashboardMetrics({
        businessType: 'Restaurant/Cafe POS',
        usageData: 'Admin primarily checks daily revenue and transaction list. Peak hours seem to be around lunch time.'
      });
      setMetrics(result.suggestedMetrics);
      setReasoning(result.reasoning);
    } catch (e) {
      setError('Failed to suggest metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>AI Metric Suggestions</CardTitle>
        <CardDescription>Get AI-powered suggestions for metrics to track.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerate} disabled={loading}>
            <Lightbulb className="mr-2 h-4 w-4" />
            {loading ? 'Thinking...' : 'Suggest Metrics'}
        </Button>

        {loading && (
            <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {metrics.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {metrics.map(metric => <Badge key={metric} variant="secondary">{metric}</Badge>)}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-secondary/50 p-4">
                <p>{reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
