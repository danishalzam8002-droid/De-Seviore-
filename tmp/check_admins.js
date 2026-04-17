require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables not found.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmins() {
  console.log('Fetching admins from Supabase...');
  const { data, error } = await supabase.from('admins').select('email, role');
  if (error) {
    console.error('Error fetching admins:', error.message);
  } else {
    if (data && data.length > 0) {
      console.log('Found following admin emails:');
      data.forEach(admin => {
        console.log(`- ${admin.email} (Role: ${admin.role})`);
      });
    } else {
      console.log('No admins found in the table.');
    }
  }
}

checkAdmins();
