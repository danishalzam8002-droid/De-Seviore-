import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "Chat API is ready", 
    model: "Gemini 1.5 Flash (Direct REST)",
    time: new Date().toISOString()
  });
}

const SYSTEM_PROMPT = `
Anda adalah "Kak Sevi", asisten virtual cerdas dan ramah untuk komunitas "De Seviore" (Angkatan 7 Ponpes Al-Azhar Purwakarta).
Ramah, sopan, gaya santai tapi hormat (seperti kakak kelas).
Daftar rute:
- Dashboard: /admin/dashboard
- Perpustakaan: /alazhar/perpustakaan
- Pendaftaran: /alazhar/info-pendaftaran
- Tentang: /alazhar/tentang
- Santri: /members
Jawablah seputar al-azhar, agama, pendidikan, dan berita terkini.
Infaq Pendidikan 1.5jt, Total Biaya Masuk 5.8jt, Bulanan 1.2jt.
`;

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_GENAI_API_KEY tidak ditemukan di environment variables server." },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    // Prepare contents for Gemini REST API
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: String(m.text || "") }]
    }));

    // Add System Instruction as the first user message if needed, 
    // or use the system_instruction field in REST API v1beta
    const payload = {
      contents: contents,
      system_instruction: {
        parts: { text: SYSTEM_PROMPT }
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini REST API Error:", errorData);
      return NextResponse.json(
        { 
          error: `Google API Error: ${response.status} ${response.statusText}`,
          details: errorData?.error?.message || "Terjadi kesalahan pada layanan Google AI."
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, Kak Sevi tidak bisa merumuskan jawaban saat ini.";

    return NextResponse.json({ text: botText });

  } catch (error: any) {
    console.error("Chat Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
