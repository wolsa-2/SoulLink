import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function moderateContent(text: string): Promise<{ isSafe: boolean; reason?: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following text for a dating/social app. 
      Strictly block: adult content, explicit sexual language, harassment, hate speech, or requests for adult services.
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["isSafe"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Moderation error:", error);
    return { isSafe: true }; // Fallback to safe if AI fails, or implement stricter fallback
  }
}

export async function getCompatibilityScore(user1: any, user2: any): Promise<{ score: number; reasoning: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Compare these two user profiles for compatibility in a friendship or long-term relationship context.
      User 1: ${JSON.stringify(user1)}
      User 2: ${JSON.stringify(user2)}
      Focus on shared interests, life goals, and values.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Compatibility score from 0 to 100" },
            reasoning: { type: Type.STRING, description: "Brief explanation of the score" }
          },
          required: ["score", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Compatibility error:", error);
    return { score: 50, reasoning: "Unable to calculate compatibility at this time." };
  }
}
