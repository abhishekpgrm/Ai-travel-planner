import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  // Relax safety settings so travel content is never silently blocked
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ],
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 16384,      // Enough for a full itinerary JSON
  responseMimeType: "application/json",  // Forces clean JSON output — no markdown fences
};

// Clean single-turn generateContent with retry logic
export const chatSession = {
  sendMessage: async (prompt, retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig,
        });

        // Surface safety block reason if response is still empty
        const candidate = result.response?.candidates?.[0];
        if (!candidate || !candidate.content?.parts?.length) {
          const reason = candidate?.finishReason || "UNKNOWN";
          throw new Error(`Gemini returned no content. Finish reason: ${reason}`);
        }

        return result;
      } catch (error) {
        if (i === retries - 1) throw error;
        if (error.message?.includes('503') || error.message?.includes('high demand')) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        } else {
          throw error;
        }
      }
    }
  },
};