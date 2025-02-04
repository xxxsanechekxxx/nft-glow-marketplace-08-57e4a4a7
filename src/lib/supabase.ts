import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://odgteaatruydxlogpbda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZ3RlYWF0cnV5ZHhsb2dwYmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNDI0OTcsImV4cCI6MjA1MzcxODQ5N30.Hc8CzqsWJfxopNaKkIi5EsYJv4tibUZY0phC8_7uL3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
});