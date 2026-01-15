
/**
 * Frontend Service giao tiếp với Vercel Serverless Function
 */
export const askGemini = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemInstruction
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || 'Lỗi kết nối AI Service');
    }

    const data = await response.json();
    return data.text || "AI không có phản hồi.";
  } catch (error: any) {
    console.error("AI Client Error:", error);
    return `Lỗi hệ thống: ${error.message}. Vui lòng đảm bảo GEMINI_API_KEY đã được thiết lập trên Vercel.`;
  }
};
