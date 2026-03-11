import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history, message, image } = body;

    // Mengambil kunci rahasia dari brankas Vercel
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Menyusun INGATAN (Memory) percakapan sebelumnya
    const formattedHistory = history.map((chat: any) => ({
      role: chat.sender === "user" ? "user" : "model",
      parts: [{ text: chat.text }],
    }));

    const chatSession = model.startChat({ history: formattedHistory });
    const promptParts: any[] = [message];

    // Jika pengguna kirim SCREENSHOT/GAMBAR, AI akan melihatnya
    if (image) {
      promptParts.push({
        inlineData: { data: image.base64, mimeType: image.mimeType },
      });
    }

    // Mengirim ke Gemini
    const result = await chatSession.sendMessage(promptParts);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "Maaf Kak, sistem jaringan aku lagi gangguan nih 🙏 Boleh diulang pertanyaannya?" }, { status: 500 });
  }
}
