import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 'placeholder') {
      return NextResponse.json({ 
        error: "RESEND_API_KEY tidak ditemukan. Silakan tambahkan kunci API di environment variable." 
      }, { status: 400 });
    }

    // Get the current user email to send the test to
    // In a real scenario, we might want to get this from the session
    // But for a simple test, we can just send it to the onboarding recipient
    // Or we can accept an email in the body
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email tujuan tidak disertakan." }, { status: 400 });
    }

    console.log(`Sending test email to: ${email}`);
    
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'De Seviore <onboarding@resend.dev>',
        to: [email],
        subject: 'Tes Koneksi Resend - De Seviore',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #1acce6; border-radius: 10px;">
            <h1 style="color: #1acce6;">Koneksi Berhasil!</h1>
            <p>Halo,</p>
            <p>Ini adalah email percobaan untuk memastikan integrasi <strong>Resend</strong> di website De Seviore sudah berjalan dengan benar.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">Waktu Pengiriman: ${new Date().toLocaleString('id-ID')}</p>
            <p style="font-size: 12px; color: #666;">Dikelola oleh Santri Al-Azhar (De Seviore Seventh Generation)</p>
          </div>
        `
      }),
    });

    if (resendRes.ok) {
      return NextResponse.json({ message: "Email percobaan berhasil dikirim!" });
    } else {
      const errBody = await resendRes.json();
      console.error("Resend API Error:", errBody);
      return NextResponse.json({ 
        error: errBody.message || "Gagal mengirim email melalui Resend API." 
      }, { status: resendRes.status });
    }
  } catch (error: any) {
    console.error("Test Email Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
