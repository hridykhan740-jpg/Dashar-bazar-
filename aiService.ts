import { GoogleGenAI, Type } from "@google/genai";
import { ALL_PRODUCTS } from "../data/seedData";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getProductRecommendations(userInterest: string): Promise<Product[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the user's interest "${userInterest}", select exactly 4 most relevant product categories from this list: ${ALL_PRODUCTS.map(p => p.category).filter((v, i, a) => a.indexOf(v) === i).join(', ')}. Return them as a JSON array of category names.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const categories = JSON.parse(response.text.trim()) as string[];
    
    // Pick one best product from each recommended category
    const recommendations = categories.map(cat => {
      const catProducts = ALL_PRODUCTS.filter(p => p.category === cat);
      return catProducts[Math.floor(Math.random() * catProducts.length)];
    }).filter(Boolean);

    return recommendations;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    // Fallback to random products
    return ALL_PRODUCTS.slice(0, 4);
  }
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (!query) return [];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5 popular search terms related to "${query}" for an e-commerce marketplace in Bangladesh. Return them as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text.trim()) as string[];
  } catch (error) {
    return ALL_PRODUCTS
      .filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map(p => p.title);
  }
}

export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const params: any = {
      model: "gemini-3-flash-preview",
      systemInstruction: "You are Dashar Bazar Bot, a premium shopping assistant for Dashar Bazar e-commerce marketplace in Bangladesh. You are helpful, professional, and can suggest products. Refer to the marketplace as Dashar Bazar. Prices are in BDT (৳). All products are located in Bangladesh. Use a bit of local flavor in your responses.",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ]
    };
    const response = await ai.models.generateContent(params);
    return response.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm sorry, I'm having trouble connecting right now. How else can I help you today?";
  }
}
