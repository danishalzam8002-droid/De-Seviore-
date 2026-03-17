import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Fetch counts from various tables
    const [membersCount, kitabCount, newsCount] = await Promise.all([
      supabase.from('members').select('*', { count: 'exact', head: true }),
      supabase.from('kitab').select('*', { count: 'exact', head: true }),
      supabase.from('berita').select('*', { count: 'exact', head: true }),
    ]);

    // Supabase Free Tier Limits (approximate defaults)
    const dbLimitRows = 50000; // General safe zone for free tier (actual is usually based on disk size)
    const dbDiskLimitMB = 500;

    // Cloudinary Free Tier (approximate)
    // 25 credits = ~25,000 transformations or storage units
    // For simplicity, we count images in DB
    const totalMediaCount = (membersCount.count || 0) + (kitabCount.count || 0) + (newsCount.count || 0);

    return NextResponse.json({
      supabase: {
        tables: {
          members: membersCount.count || 0,
          kitab: kitabCount.count || 0,
          news: newsCount.count || 0,
        },
        limits: {
          rows: dbLimitRows,
          diskMB: dbDiskLimitMB,
        }
      },
      cloudinary: {
        estimatedItems: totalMediaCount,
        limitCredits: 25,
      },
      vercel: {
        bandwidthLimitGB: 100,
        buildMinutesLimit: 6000,
      }
    });

  } catch (error: any) {
    console.error('Usage monitoring error:', error);
    return NextResponse.json({ error: 'Failed to fetch usage data' }, { status: 500 });
  }
}
