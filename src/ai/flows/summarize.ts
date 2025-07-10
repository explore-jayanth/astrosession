'use server';
/**
 * @fileOverview A flow for summarizing text.
 *
 * - summarize - A function that handles the summarization process.
 * - SummarizeInput - The input type for the summarize function.
 * - SummarizeOutput - The return type for the summarize function.
 */
import { z } from "genkit";
import { ai } from "../genkit";

const SummarizeInputSchema = z.string();
export type SummarizeInput = z.infer<typeof SummarizeInputSchema>;

const SummarizeOutputSchema = z.string();
export type SummarizeOutput = z.infer<typeof SummarizeOutputSchema>;

export async function summarize(transcript: SummarizeInput): Promise<SummarizeOutput> {
  return summarizeFlow(transcript);
}

const summarizeFlow = ai.defineFlow(
  {
    name: "summarizeFlow",
    inputSchema: SummarizeInputSchema,
    outputSchema: SummarizeOutputSchema,
  },
  async (transcript) => {
    if (!transcript) {
      return "The meeting transcript was empty.";
    }

    const llmResponse = await ai.generate(
      `Summarize the following astrology consultation transcript. Focus on the key questions asked and the core advice given. Keep it concise and clear.
        
        Transcript:
        ---
        ${transcript}
        ---
        
        Summary:`
    );
    
    return llmResponse.text;
  }
);
