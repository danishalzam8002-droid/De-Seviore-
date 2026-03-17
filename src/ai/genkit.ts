import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

console.log("Genkit initialization. API Key exists:", !!process.env.GOOGLE_GENAI_API_KEY);

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
  model: 'googleai/gemini-3-flash-preview',
});
