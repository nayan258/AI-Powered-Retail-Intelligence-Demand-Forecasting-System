import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
// Initialize without throwing error immediately if missing, to allow graceful fallback
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateBusinessInsight(context: string): Promise<string> {
  if (!ai) {
    // Fallback rule-based insight
    return `Rule-Based Insight: Based on the current analytics, focus on optimizing your top 3 product categories. Sales have shown volatility over the last 30 days, suggesting a need for dynamic pricing.`;
  }

  try {
    const prompt = `
      You are an expert AI Data Analyst for a retail business. 
      Given the following data summary, provide ONE highly actionable, concise sentence (max 25 words) of business insight or recommendation. 
      Be professional, direct, and insightful. No fluff.
      
      DATA CONTEXT:
      ${context}
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
    });
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Insight Engine currently unavailable. Monitor key performance indicators across top regions.";
  }
}
