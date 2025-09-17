import { config } from 'dotenv';
config();

import '@/ai/flows/clinical-note-transcription.ts';
import '@/ai/flows/ai-symptom-analysis.ts';
import '@/ai/flows/risk-score-calculation.ts';