'use server';
/**
 * @fileOverview A GenAI tool for suggesting inspirational or reflective quotes ('kata-kata').
 *
 * - suggestQuote - A function that suggests a quote based on keywords or themes.
 * - QuoteSuggestionInput - The input type for the suggestQuote function.
 * - QuoteSuggestionOutput - The return type for the suggestQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuoteSuggestionInputSchema = z.object({
  keywords: z.string().describe('Keywords or themes to base the quote on, e.g., "perseverance", "community", "growth".'),
});
export type QuoteSuggestionInput = z.infer<typeof QuoteSuggestionInputSchema>;

const QuoteSuggestionOutputSchema = z.object({
  quote: z.string().describe('An inspirational or reflective quote based on the provided keywords.'),
});
export type QuoteSuggestionOutput = z.infer<typeof QuoteSuggestionOutputSchema>;

const quoteSuggestionPrompt = ai.definePrompt({
  name: 'quoteSuggestionPrompt',
  input: {schema: QuoteSuggestionInputSchema},
  output: {schema: QuoteSuggestionOutputSchema},
  prompt: `You are an AI assistant specialized in generating inspirational and reflective quotes in Indonesian (Bahasa Indonesia).
Based on the following keywords or themes, generate a single, concise, and profound quote in Indonesian.
The quote should be suitable for a personal biography section, aiming to inspire or reflect on life experiences.
Do not include quotation marks or any additional explanations. Please provide ONLY the quote.

Keywords/Themes: {{{keywords}}}`
});

const quoteSuggestionFlow = ai.defineFlow(
  {
    name: 'quoteSuggestionFlow',
    inputSchema: QuoteSuggestionInputSchema,
    outputSchema: QuoteSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await quoteSuggestionPrompt(input);
    return output!;
  }
);

export async function suggestQuote(input: QuoteSuggestionInput): Promise<QuoteSuggestionOutput> {
  return quoteSuggestionFlow(input);
}
