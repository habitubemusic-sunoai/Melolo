import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history, message, image } = body;
    
    // Ambil kunci dari Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AIzaSyAZQjMfYaXAViJYepVHHgwSE98wR5JCA5g");

    // Format chat dijadikan satu paragraf agar Google tidak bingung
    let chatContext = "Kamu CS Habi Music (Cewek Jawa Timur). Jawab santai, logis, maks 2 kalimat.\nRiwayat:\n";
    history.forEach((chat: any) => {
      chatContext += `${chat.sender === 'user' ? 'User' : 'Kamu'}: ${chat.text}\n`;
    });
    chatContext += `\nPesan Baru User: ${message}\nBalasanmu:`;

    const parts: any[] = [{ text: chatContext }];

    if (image && image.base64) {
      parts.push({ inline_data: { mime_type: image.mimeType, data: image.base64 } });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: parts }] })
    });

    const data = await res.json();
    if (!res.ok) throw new Error("GEMINI_ERROR");

    const reply = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ reply: reply.replace(/\*/g, '') });

  } catch (error) {
    // Jika Gemini gagal, kembalikan status 500 agar UI pakai Otak Cadangan
    return NextResponse.json({ error: "FAILED" }, { status: 500 });
  }
}
