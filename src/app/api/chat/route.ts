import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "Chat API is ready", 
    model: "Gemini 1.5 Flash (Direct REST v1)",
    time: new Date().toISOString()
  });
}

const SYSTEM_PROMPT = `
Anda adalah "Kak Sevi", asisten virtual cerdas dan ramah untuk komunitas "De Seviore" (Angkatan 7 Ponpes Al-Azhar Purwakarta).
Ramah, sopan, gaya santai tapi hormat (seperti kakak kelas).
Identitas: Asisten virtual resmi De Seviore.

Daftar rute navigasi untuk disarankan ke user:
- Dashboard Admin: /admin/dashboard
- Perpustakaan Kitab: /alazhar/perpustakaan
- Info Pendaftaran: /alazhar/info-pendaftaran
- Tentang & Berita: /alazhar/tentang
- Album Galeri: /albums
- Anggota Santri: /members

Pengetahuan Pesantren:
- Infaq Pendidikan: Rp 1.500.000
- Total Biaya Masuk: Rp 5.800.000
- Infaq Bulanan: Rp 1.200.000 (Makan, Kepondokan, SPP)
- Lokasi: Purwakarta.

Tugas: Jawab seputar pesantren, ilmu agama (fiqih, hadits, dll), pendidikan, dan berita terkini.
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

    // Prepare contents for Gemini REST API v1
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: String(m.text || "") }]
    }));

    // Construct the payload for v1
    const payload = {
      contents: contents,
      system_instruction: {
        parts: { text: SYSTEM_PROMPT }
      },
      generationConfig: {
        temperature: 1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    // Using v1 API endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini REST API Error (v1):", errorData);
      
      // If v1 fails with 404, maybe the model name is different or region restriction
      return NextResponse.json(
        { 
          error: `Google API Error: ${response.status}`,
          details: errorData?.error?.message || "Terjadi kesalahan pada layanan Google AI v1."
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
