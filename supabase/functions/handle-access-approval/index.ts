import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-client@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, role, status, name } = await req.json()
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (status === 'approved') {
      // 1. Create Auth User (Admin Level)
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name, role: role }
      })

      if (authError) throw authError

      // 2. Add to Admins database table
      const { error: dbError } = await supabaseAdmin
        .from('admins')
        .insert([{ email, role }])

      if (dbError) throw dbError

      // 3. Send Success Email via Resend
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
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
              <a href="https://de-seviore.vercel.app/login" style="display: inline-block; padding: 10px 20px; background-color: #1acce6; color: white; text-decoration: none; border-radius: 5px;">Login Sekarang</a>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">Dikelola oleh Santri Al-Azhar (De Seviore Seventh Generation)</p>
            </div>
          `
        }),
      })

      return new Response(JSON.stringify({ message: 'Approved and Account Created' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      // Logic for Rejection
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'De Seviore <onboarding@resend.dev>',
          to: [email],
          subject: 'Pemberitahuan Pengajuan Akses De Seviore',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #ff4444;">Halo, ${name}</h2>
              <p>Mohon maaf, pengajuan akses Anda untuk website De Seviore saat ini **BELUM DAPAT DISETUJUI**.</p>
              <p>Silakan hubungi Admin Utama jika Anda merasa ada kesalahan data.</p>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">Terima kasih atas minat Anda bergabung sebagai pengelola.</p>
            </div>
          `
        }),
      })

      return new Response(JSON.stringify({ message: 'Rejected but Email Sent' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
