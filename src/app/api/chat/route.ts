import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history, message, image } = body;
    
    // Mengambil kunci dari Brankas Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ reply: "Maaf Kak, Kunci API rahasia belum dipasang di Vercel nih 🙏" });
    }

    // 1. Susun Ingatan (Memori Chat Sebelumnya)
    const contents = history.map((chat: any) => ({
      role: chat.sender === "user" ? "user" : "model",
      parts: [{ text: chat.text || "halo" }]
    }));

    // 2. Tambahkan Pesan Baru & Gambar (Jika ada Screenshot)
    const currentParts: any[] = [{ text: message }];
    if (image && image.base64) {
      currentParts.push({
        inline_data: {
          mime_type: image.mimeType,
          data: image.base64
        }
      });
    }
    contents.push({ role: "user", parts: currentParts });

    // 3. Tembak Langsung ke Server Google Gemini (Tanpa Paket Tambahan!)
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Gemini Error:", data);
      return NextResponse.json({ reply: "Maaf Kak, jaringanku ke server lagi padat banget nih 🙏 Boleh diulang?" });
    }

    const reply = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ reply: reply.replace(/\*/g, '') });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "Maaf Kak, sistem aku lagi agak nge-lag 🙏 Sebentar ya." });
  }
}
