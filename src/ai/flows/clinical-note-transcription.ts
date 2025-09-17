// src/ai/flows/clinical-note-transcription.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for transcribing spoken clinical notes into structured text.
 *
 * - clinicalNoteTranscription - A function that handles the clinical note transcription process.
 * - ClinicalNoteTranscriptionInput - The input type for the clinicalNoteTranscription function.
 * - ClinicalNoteTranscriptionOutput - The return type for the clinicalNoteTranscription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ClinicalNoteTranscriptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data of spoken clinical notes, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClinicalNoteTranscriptionInput = z.infer<typeof ClinicalNoteTranscriptionInputSchema>;

const ClinicalNoteTranscriptionOutputSchema = z.object({
  transcription: z.string().describe('The transcribed clinical notes in structured text format.'),
});
export type ClinicalNoteTranscriptionOutput = z.infer<typeof ClinicalNoteTranscriptionOutputSchema>;

export async function clinicalNoteTranscription(
  input: ClinicalNoteTranscriptionInput
): Promise<ClinicalNoteTranscriptionOutput> {
  return clinicalNoteTranscriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'clinicalNoteTranscriptionPrompt',
  input: {schema: ClinicalNoteTranscriptionInputSchema},
  output: {schema: ClinicalNoteTranscriptionOutputSchema},
  prompt: `You are a medical scribe. Transcribe the following audio into a clear, structured clinical note.

Audio: {{media url=audioDataUri}}`,
});

const clinicalNoteTranscriptionFlow = ai.defineFlow(
  {
    name: 'clinicalNoteTranscriptionFlow',
    inputSchema: ClinicalNoteTranscriptionInputSchema,
    outputSchema: ClinicalNoteTranscriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
