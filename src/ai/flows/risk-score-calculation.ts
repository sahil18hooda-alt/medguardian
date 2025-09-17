'use server';

/**
 * @fileOverview An AI agent to calculate patient risk scores based on demographics, historical data, and current health conditions.
 *
 * - calculateRiskScore - A function that handles the risk score calculation process.
 * - RiskScoreInput - The input type for the calculateRiskScore function.
 * - RiskScoreOutput - The return type for the calculateRiskScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskScoreInputSchema = z.object({
  demographics: z.object({
    age: z.number().describe('The age of the patient.'),
    gender: z.string().describe('The gender of the patient.'),
    location: z.string().describe('The location of the patient.'),
  }).describe('Demographic information of the patient.'),
  historicalData: z.object({
    previousConditions: z.array(z.string()).describe('List of previous health conditions of the patient.'),
    hospitalAdmissions: z.number().describe('Number of past hospital admissions.'),
  }).describe('Historical health data of the patient.'),
  currentHealthConditions: z.object({
    symptoms: z.array(z.string()).describe('List of current symptoms reported by the patient.'),
    diagnosis: z.string().describe('Current diagnosis of the patient.'),
  }).describe('Current health conditions of the patient.'),
});
export type RiskScoreInput = z.infer<typeof RiskScoreInputSchema>;

const RiskScoreOutputSchema = z.object({
  riskScore: z.number().describe('The calculated risk score for the patient.'),
  riskLevel: z.string().describe('The level of risk associated with the calculated score (e.g., Low, Medium, High).'),
  rationale: z.string().describe('The rationale behind the calculated risk score, explaining the contributing factors.'),
});
export type RiskScoreOutput = z.infer<typeof RiskScoreOutputSchema>;

export async function calculateRiskScore(input: RiskScoreInput): Promise<RiskScoreOutput> {
  return calculateRiskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateRiskScorePrompt',
  input: {schema: RiskScoreInputSchema},
  output: {schema: RiskScoreOutputSchema},
  prompt: `You are an AI assistant that calculates a patient's risk score based on their demographics, historical data, and current health conditions.

  Calculate the risk score based on the following information:

  Demographics: {{{JSON.stringify(demographics, null, 2)}}}
  Historical Data: {{{JSON.stringify(historicalData, null, 2)}}}
  Current Health Conditions: {{{JSON.stringify(currentHealthConditions, null, 2)}}}

  Provide a riskScore (numerical value), riskLevel (Low, Medium, or High), and a rationale explaining the contributing factors to the risk score.
`,
});

const calculateRiskScoreFlow = ai.defineFlow(
  {
    name: 'calculateRiskScoreFlow',
    inputSchema: RiskScoreInputSchema,
    outputSchema: RiskScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
