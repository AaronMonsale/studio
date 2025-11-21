'use server';

/**
 * @fileOverview Generates key sales insights using AI based on transaction history.
 *
 * - generateSalesReportInsights - A function that triggers the sales report insights generation process.
 * - GenerateSalesReportInsightsInput - The input type for the generateSalesReportInsights function (currently empty).
 * - GenerateSalesReportInsightsOutput - The return type for the generateSalesReportInsights function, containing the insights.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesReportInsightsInputSchema = z.object({});
export type GenerateSalesReportInsightsInput = z.infer<typeof GenerateSalesReportInsightsInputSchema>;

const GenerateSalesReportInsightsOutputSchema = z.object({
  insights: z.string().describe('Key sales insights generated from transaction history.'),
});
export type GenerateSalesReportInsightsOutput = z.infer<typeof GenerateSalesReportInsightsOutputSchema>;

export async function generateSalesReportInsights(
  input: GenerateSalesReportInsightsInput
): Promise<GenerateSalesReportInsightsOutput> {
  return generateSalesReportInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesReportInsightsPrompt',
  input: {schema: GenerateSalesReportInsightsInputSchema},
  output: {schema: GenerateSalesReportInsightsOutputSchema},
  prompt: `Analyze the transaction history and generate key sales insights. Focus on identifying sales trends, 
  best-selling products, peak sales times, and customer behavior patterns. Provide actionable recommendations based on these insights.
  Return the result as a text summary.`,
});

const generateSalesReportInsightsFlow = ai.defineFlow(
  {
    name: 'generateSalesReportInsightsFlow',
    inputSchema: GenerateSalesReportInsightsInputSchema,
    outputSchema: GenerateSalesReportInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
