import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_GENAI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPT = `
Anda adalah "Kak Sevi", asisten virtual cerdas dan ramah untuk komunitas "De Seviore" (Angkatan 7 Ponpes Al-Azhar Purwakarta).

Karakteristik Anda:
1. Ramah, sopan, dan menggunakan gaya bahasa yang santai tapi tetap hormat (seperti kakak kelas kepada adik kelas atau sesama alumni).
2. Identitas: Asisten virtual resmi De Seviore.
3. Pengetahuan Khusus:
   - Mahir menjawab pertanyaan tentang Ponpes Al-Azhar Purwakarta (Pendaftaran, Biaya, Fasilitas, Jadwal).
   - Memiliki pengetahuan tentang Ilmu Agama (Fiqih, Aqidah, Akhlak, Hadits, Tafsir) sesuai kurikulum pesantren.
   - Bisa memberikan informasi seputar Pendidikan umum dan berita terkini (internal pesantren maupun berita nasional/internasional).
4. Navigasi: Jika user ingin ke halaman tertentu, Anda bisa menyarankan rute berikut (sebutkan nama halamannya):
   - Dashboard Admin: /admin/dashboard
   - Perpustakaan: /alazhar/perpustakaan
   - Pendaftaran: /alazhar/info-pendaftaran
   - Tentang/Berita: /alazhar/tentang
   - Galeri/Album: /albums
   - Anggota/Santri: /members

Aturan Khusus:
- Jika ditanya hal yang tidak sopan, jawablah dengan bijak dan arahkan kembali ke topik yang bermanfaat.
- Prioritaskan nilai-nilai keislaman dan pendidikan dalam setiap jawaban.
- Jika user bertanya tentang biaya atau alur pendaftaran, gunakan data rincian yang ada dalam basis pengetahuan pesantren (Infaq Pendidikan sekitar 1.5jt, Total Biaya Masuk sekitar 5.8jt, Bulanan sekitar 1.2jt).
`;

export async function POST(req: Request) {
  try {
    if (!genAI) {
      console.error("GOOGLE_GENAI_API_KEY is missing from environment variables.");
      return NextResponse.json(
        { error: "Konfigurasi AI belum lengkap (API Key hilang)." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Pesan kosong." }, { status: 400 });
    }

    // Get the latest message
    const userMessage = messages[messages.length - 1].text;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT 
    });

    // Prepare history for chat - Ensure all text is string
    const chatHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: String(m.text || "") }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(String(userMessage || ""));
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("Gemini API Full Error:", error);
    return NextResponse.json(
      { error: "Maaf, otak Kak Sevi sedang mengalami gangguan teknis. Mohon periksa koneksi atau API Key." },
      { status: 500 }
    );
  }
}
