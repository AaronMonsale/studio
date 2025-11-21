'use server';

/**
 * @fileOverview Suggests relevant business metrics for the admin dashboard based on observed usage data and AI analysis.
 *
 * - suggestDashboardMetrics - A function that suggests dashboard metrics.
 * - SuggestDashboardMetricsInput - The input type for the suggestDashboardMetrics function.
 * - SuggestDashboardMetricsOutput - The return type for the suggestDashboardMetrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDashboardMetricsInputSchema = z.object({
  usageData: z.string().describe('Observed usage data of the dashboard.'),
  businessType: z.string().describe('The type of business the dashboard is for.'),
});
export type SuggestDashboardMetricsInput = z.infer<typeof SuggestDashboardMetricsInputSchema>;

const SuggestDashboardMetricsOutputSchema = z.object({
  suggestedMetrics: z.array(z.string()).describe('An array of suggested business metrics for the dashboard.'),
  reasoning: z.string().describe('The reasoning behind the suggested metrics.'),
});
export type SuggestDashboardMetricsOutput = z.infer<typeof SuggestDashboardMetricsOutputSchema>;

export async function suggestDashboardMetrics(input: SuggestDashboardMetricsInput): Promise<SuggestDashboardMetricsOutput> {
  return suggestDashboardMetricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDashboardMetricsPrompt',
  input: {schema: SuggestDashboardMetricsInputSchema},
  output: {schema: SuggestDashboardMetricsOutputSchema},
  prompt: `You are an expert business analyst. Given the following usage data and business type, suggest the most relevant business metrics for the dashboard.

Usage Data: {{{usageData}}}
Business Type: {{{businessType}}}

Consider metrics that will provide insight into sales trends, customer behavior, and overall business performance.

Output an array of suggested metrics and a brief explanation for each.

Example Output:
{
  "suggestedMetrics": ["Total Revenue", "Customer Acquisition Cost", "Average Order Value"],
  "reasoning": "Total Revenue provides an overview of overall sales performance. Customer Acquisition Cost helps understand the efficiency of marketing efforts. Average Order Value indicates the spending habits of customers."
}
`,
});

const suggestDashboardMetricsFlow = ai.defineFlow(
  {
    name: 'suggestDashboardMetricsFlow',
    inputSchema: SuggestDashboardMetricsInputSchema,
    outputSchema: SuggestDashboardMetricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
