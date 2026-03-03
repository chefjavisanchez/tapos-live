const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "FOUND" : "MISSING");
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "FOUND" : "MISSING");
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "FOUND" : "MISSING");

const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

async function test() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await sb.from('cards').select('count', { count: 'exact', head: true });
    console.log("Supabase Auth Test:", error ? "FAILED: " + error.message : "SUCCESS (Counted items)");

    if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        try {
            // Just validate the key if possible, or send a test email to the user's email if safe
            // We'll just check if the client initializes
            console.log("Resend Client: INITIALIZED");
        } catch (e) {
            console.log("Resend Client: FAILED", e.message);
        }
    }
}

test();
