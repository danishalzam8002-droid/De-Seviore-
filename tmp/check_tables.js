require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  console.log('Fetching table list from Supabase...');
  // This is a common way to test connection and see if public tables are accessible
  const { data, error } = await supabase.from('members').select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error with "members" table:', error.message);
  } else {
    console.log('"members" table exists. Count:', data.length);
  }

  // Try fetching from "admins" again
  const { data: adminData, error: adminError } = await supabase.from('admins').select('*', { count: 'exact', head: true });
  if (adminError) {
     console.error('Error with "admins" table:', adminError.message);
  } else {
     console.log('"admins" table exists.');
  }
}

listTables();
