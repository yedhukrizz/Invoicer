import { GoogleGenAI } from "@google/genai";

export const generateInvoiceTerms = async (tone: 'polite' | 'strict' | 'standard'): Promise<string> => {
  if (!process.env.API_KEY) return "Please configure API Key for AI features.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const prompt = `Write a short, professional invoice payment terms paragraph. Tone: ${tone}. Max 2 sentences.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Payment due on receipt.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Payment due within 30 days.";
  }
};

export const generateItemDescription = async (keywords: string): Promise<string> => {
   if (!process.env.API_KEY) return keywords;

   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
   try {
     const prompt = `Expand these keywords into a professional invoice line item description (max 10 words): "${keywords}"`;
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
     });
     return response.text?.replace(/['"]+/g, '') || keywords;
   } catch (error) {
     return keywords;
   }
}