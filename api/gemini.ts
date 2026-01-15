
import { GoogleGenAI } from "@google/genai";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: any, res: any) {
  // Chỉ chấp nhận POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, systemInstruction } = req.body;
    
    // Lấy API Key từ biến môi trường của Vercel
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Cấu hình hệ thống thiếu API Key (GEMINI_API_KEY)' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Nội dung yêu cầu (prompt) không được để trống' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Sử dụng model gemini-2.5-flash theo yêu cầu
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction || "Bạn là một chuyên gia phân tích dữ liệu giáo dục chuyên nghiệp.",
        temperature: 0.7,
      },
    });

    const text = response.text;

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("Vercel Serverless Error:", error);
    return res.status(500).json({ 
      error: 'Lỗi xử lý AI', 
      details: error.message 
    });
  }
}
