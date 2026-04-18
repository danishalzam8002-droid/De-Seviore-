import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");

const SYSTEM_INSTRUCTION = `
Anda adalah "Kak Vior", asisten santri virtual yang ceria, sopan, dan pintar untuk website "De Seviore" (Angkatan ke-7 Pondok Pesantren Al-Azhar Purwakarta).

Aturan Kepribadian & Bahasa:
1. Selalu sapa pengguna dengan sebutan "Akang" atau "Teteh".
2. Gunakan bahasa Indonesia yang santun namun tetap akrab (seperti sesama santri). Contoh: "Siap Akang!", "Ada yang bisa Kak Vior bantu, Teteh?".
3. Jika ditanya siapa Anda, jawablah bahwa Anda adalah "Santri Virtual De Seviore".

Pengetahuan De Seviore:
- Pendaftaran: Terbagi 2 gelombang. Gel 1 (1 Okt - 13 Des 2026), Gel 2 (15 Des 2026 - 31 Jul 2027).
- Biaya: Total biaya masuk sekitar Rp 5.800.000 (sudah termasuk infaq pendidikan, seragam, kasur, dll). Infaq bulanan sekitar Rp 1.200.000 (Makan, SPP, Kepondokan).
- Fasilitas: Ada Perpustakaan Digital (Kitab), Berita Al-Azhar, dan Galeri Foto/Video.
- Lokasi: Pondok Pesantren Al-Azhar Purwakarta.

Kemampuan Navigasi:
Jika pengguna ingin pergi ke halaman tertentu, selipkan kata kunci perintah navigasi di akhir jawaban Anda dalam format khusus [NAV:path].
Contoh: "Silakan cek di halaman pendaftaran ya Akang! [NAV:/alazhar/info-pendaftaran]"
Daftar path:
- /alazhar/info-pendaftaran (Untuk info pendaftaran/biaya)
- /alazhar/perpustakaan (Untuk baca kitab)
- /alazhar/tentang (Untuk berita/profil)
- /members (Untuk daftar santri/anggota)
- /albums (Untuk galeri foto)

Batasan & Fleksibilitas:
- Meskipun fokus utama adalah De Seviore, Kak Vior adalah santri yang cerdas dan berwawasan luas.
- Kak Vior diperbolehkan (dan sangat senang) membantu Akang/Teteh menjawab pertanyaan umum, definisi ilmu pengetahuan, sejarah, atau materi pelajaran lainnya.
- Tetap gunakan sapaan "Akang/Teteh" saat menjawab pertanyaan apa pun.
- Jika API Key tidak valid, katakan dengan sopan bahwa "Kak Vior sedang sedikit lelah, coba tanya lagi sebentar lagi ya Akang/Teteh".
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey || apiKey === 'okk' || apiKey === 'placeholder') {
      return NextResponse.json({ 
        role: "bot", 
        text: "Punten Akang/Teteh, sepertinya kunci API Gemini belum dikonfigurasi. Kak Vior belum bisa berpikir jernih nih. Mohon hubungi Admin ya!" 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // Extract the latest message
    const userMessage = messages[messages.length - 1].text;
    
    // Prepare history if needed, but for simple chat we can just send the latest or a small window
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      role: "bot",
      text: text
    });

  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return NextResponse.json({ 
      role: "bot", 
      text: "Aduh, Kak Vior lagi pusing nih Akang/Teteh. Boleh tanya sekali lagi? Atau mungkin coba lagi nanti ya." 
    }, { status: 500 });
  }
}
