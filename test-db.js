const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_APP_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data, error } = await supabase.from('leads').select('*').limit(1);
  console.log("Leads fetch:", { data, error });
  
  const { data: cData, error: cErr } = await supabase.from('cards').select('id').limit(1);
  console.log("Cards fetch:", { cData, cErr });
}
run();
