import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rlxmrymfyyfachjbehig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJseG1yeW1meXlmYWNoamJlaGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTUwNTAsImV4cCI6MjA4OTI3MTA1MH0.3-TCgepgnazE6cyuXf6M5_FAgfS1_SXE800aYvYsTl4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmins() {
  const { data, error } = await supabase
    .from('admins')
    .select('*');
    
  if (error) {
    console.error('Error fetching admins:', error);
    return;
  }
  
  console.log('Admins List:', JSON.stringify(data, null, 2));
}

checkAdmins();
