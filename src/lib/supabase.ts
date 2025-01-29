import { createClient } from '@supabase/supabase-js';

// Замените эти значения на ваши из настроек проекта Supabase
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);