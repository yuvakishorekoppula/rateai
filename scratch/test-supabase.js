import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oewfpwogtmxyaifjoiij.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ld2Zwd29ndG14eWFpZmpvaWlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODExODk3OCwiZXhwIjoyMDkzNjk0OTc4fQ.ZnQrlPHdUtkPIsp0KsF2X8koBAsBEEjS1QJG4DwSQDA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log("Attempting to connect to Supabase...");
  
  try {
    const { error } = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    if (error) {
      console.error("❌ Connection failed!");
      console.error("Error details:", error.message);
      if (error.code === 'PGRST116') {
        console.log("💡 Tip: This might mean the 'leads' table doesn't exist yet.");
      }
    } else {
      console.log("✅ Connection SUCCESSFUL.");
      console.log("Database response received.");
    }
  } catch (err) {
    console.error("❌ A critical error occurred:");
    console.error(err);
  }
}

testConnection();
