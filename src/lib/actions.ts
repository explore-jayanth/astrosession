"use server";

import { summarize } from "@/ai/flows/summarize";

export async function generateSummaryAction(transcript: string) {
  try {
    const summary = await summarize(transcript);
    return summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Sorry, we couldn't generate a summary at this time.";
  }
}
