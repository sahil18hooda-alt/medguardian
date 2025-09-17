'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const XrayAnalysisInputSchema = z.object({
  image: z.string().describe('The X-ray image to be analyzed, as a data URL.'),
});
export type XrayAnalysisInput = z.infer<typeof XrayAnalysisInputSchema>;

const XrayAnalysisOutputSchema = z.object({
  analysis: z.array(z.object({
    condition: z.string().describe('The potential condition identified in the X-ray.'),
    probability: z.number().describe('The probability of the condition being present.'),
  })).describe('The analysis of the X-ray image.'),
  summary: z.string().describe('A summary of the findings.'),
});
export type XrayAnalysisOutput = z.infer<typeof XrayAnalysisOutputSchema>;

export async function xrayAnalysis(input: XrayAnalysisInput): Promise<XrayAnalysisOutput> {
  return xrayAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'xrayAnalysisPrompt',
  input: {schema: XrayAnalysisInputSchema},
  output: {schema: XrayAnalysisOutputSchema},
  prompt: `You are a world-class radiologist. Analyze the provided X-ray image and identify potential medical conditions. Provide a list of possible conditions with their corresponding probabilities, and a summary of your findings.

  Image: {{{image}}}
`,
});

const xrayAnalysisFlow = ai.defineFlow(
  {
    name: 'xrayAnalysisFlow',
    inputSchema: XrayAnalysisInputSchema,
    outputSchema: XrayAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
