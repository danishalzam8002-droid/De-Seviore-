import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { email, password, role, status, name } = await req.json();
    const resendApiKey = process.env.RESEND_API_KEY;
    const supabaseAdmin = createAdminClient();

    if (status === 'approved') {
      // 1. Create Auth User (Admin Level)
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name, role: role }
      });

      if (authError) {
        console.error("Auth Error:", authError);
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      // 2. Add to Admins database table
      const { error: dbError } = await supabaseAdmin
        .from('admins')
        .insert([{ email, role }]);

      if (dbError) {
        console.error("DB Error:", dbError);
        return NextResponse.json({ error: dbError.message }, { status: 400 });
      }

      // 3. Send Success Email via Resend HTTP API
      if (resendApiKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'De Seviore <onboarding@resend.dev>',
              to: [email],
              subject: 'Akses Pengurus De Seviore Diterima!',
              html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                  <h1 style="color: #1acce6;">Selamat, ${name}!</h1>
                  <p>Pengajuan akses Anda sebagai <strong>${role}</strong> di website De Seviore telah <strong>DISETUJUI</strong> oleh Admin Utama.</p>
                  <p>Anda sekarang dapat login menggunakan email dan password yang Anda buat sebelumnya.</p>
                  <a href="${req.headers.get('origin')}/login" style="display: inline-block; padding: 10px 20px; background-color: #1acce6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Sekarang</a>
                  <p style="margin-top: 20px; font-size: 12px; color: #666;">Dikelola oleh Santri Al-Azhar (De Seviore Seventh Generation)</p>
                </div>
              `
            }),
          });
        } catch (emailErr) {
          console.error("Email Sending Error:", emailErr);
          // Don't fail the whole request if only email fails
        }
      }

      return NextResponse.json({ message: 'Approved and Account Created' });
    } else {
      // Logic for Rejection Email
      if (resendApiKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'De Seviore <onboarding@resend.dev>',
              to: [email],
              subject: 'Pemberitahuan Pengajuan Akses De Seviore',
              html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                  <h2 style="color: #ff4444;">Halo, ${name}</h2>
                  <p>Mohon maaf, pengajuan akses Anda untuk website De Seviore saat ini <strong>BELUM DAPAT DISETUJUI</strong>.</p>
                  <p>Silakan hubungi Admin Utama jika Anda merasa ada kesalahan data.</p>
                  <p style="margin-top: 20px; font-size: 12px; color: #666;">Terima kasih atas minat Anda bergabung sebagai pengelola.</p>
                </div>
              `
            }),
          });
        } catch (emailErr) {
          console.error("Email Sending Error:", emailErr);
        }
      }

      return NextResponse.json({ message: 'Rejected' });
    }
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
