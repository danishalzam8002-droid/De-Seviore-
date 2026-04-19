import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    // Increase timeout and add headers to mimic a real browser
    const response = await fetch('https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta', {
      next: { revalidate: 3600 }, // Cache results for 1 hour
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const students: any[] = [];
    
    // Attempt to target the table in the accepted students section
    // Based on Cazh/Livewire patterns, it's often inside a table with a specific class or ID
    // We'll look for tables within the section that likely contains the students
    
    $('#accepted-students table tbody tr, .accepted-students-table tbody tr').each((_, el) => {
      const cols = $(el).find('td');
      if (cols.length >= 2) {
        students.push({
          name: $(cols[0]).text().trim(),
          id: $(cols[1]).text().trim(),
          school: $(cols[2] || '').text().trim(),
          status: $(cols[3] || '').text().trim() || 'Diterima'
        });
      }
    });

    // Fallback if specific ID selector fails: look for any table rows with student-like data
    if (students.length === 0) {
      $('table tbody tr').each((_, el) => {
        const text = $(el).text().toLowerCase();
        if (text.includes('lulus') || text.includes('diterima')) {
           const cols = $(el).find('td');
           if (cols.length >= 2) {
             students.push({
               name: $(cols[0]).text().trim(),
               id: $(cols[1]).text().trim(),
               school: $(cols[2] || '').text().trim(),
               status: $(cols[3] || '').text().trim()
             });
           }
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      count: students.length, 
      data: students,
      lastUpdated: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('PPDB Scraping error:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal mengambil data santri dari pusat. Silakan coba beberapa saat lagi.',
      details: error.message
    }, { status: 500 });
  }
}
