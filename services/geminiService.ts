
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we'll log an error.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getMedicineInfo = async (medicineName: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("API Key not configured. Cannot fetch medicine information.");
  }
  try {
    const prompt = `You are a helpful pharmacy assistant. Provide a brief, easy-to-understand description for the medicine "${medicineName}". Include its primary use, how to take it, and common side effects. Format the response in simple markdown. Keep the response to 4-5 sentences.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    if (response.text) {
      return response.text;
    }
    return "Could not retrieve information for this medicine.";

  } catch (error) {
    console.error("Error fetching medicine info from Gemini:", error);
    return "An error occurred while fetching medicine information. Please try again later.";
  }
};
