'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI symptom analysis.
 *
 * - analyzeSymptoms - An exported function that takes symptom input and returns potential causes and next steps.
 * - SymptomAnalysisInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalysisOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomAnalysisInputSchema = z.object({
  symptoms: z
    .string()
    .describe("A detailed description of the patient's symptoms."),
  age: z.number().optional().describe('The age of the patient in years.'),
  gender: z
    .enum(['male', 'female', 'other'])
    .optional()
    .describe('The gender of the patient.'),
});
export type SymptomAnalysisInput = z.infer<typeof SymptomAnalysisInputSchema>;

const SymptomAnalysisOutputSchema = z.object({
  potentialCauses: z
    .string()
    .describe('A list of potential causes for the symptoms.'),
  recommendedNextSteps: z
    .string()
    .describe('Recommended next steps for the patient.'),
});
export type SymptomAnalysisOutput = z.infer<typeof SymptomAnalysisOutputSchema>;

export async function analyzeSymptoms(
  input: SymptomAnalysisInput
): Promise<SymptomAnalysisOutput> {
  return analyzeSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalysisPrompt',
  input: {schema: SymptomAnalysisInputSchema},
  output: {schema: SymptomAnalysisOutputSchema},
  prompt: `You are an AI medical assistant. Analyze the following symptoms and provide potential causes and recommended next steps.

Symptoms: {{{symptoms}}}

{{#if age}}Age: {{{age}}}{{/if}}
{{#if gender}}Gender: {{{gender}}}{{/if}}

Potential Causes:
Recommended Next Steps:`,
});

const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
