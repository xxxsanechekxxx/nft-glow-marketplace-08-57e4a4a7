import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://f62ecaab-efae-45fe-b236-5cb3821796db.lovableproject.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImY2MmVjYWFiLWVmYWUtNDVmZS1iMjM2LTVjYjM4MjE3OTZkYiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzA2OTM4NjE2LCJleHAiOjIwMjI1MTQ2MTZ9.zqKQ9KyXpcgz9EM-XBGxDJwJvHI5EH_MBcOKyBGJR1Q';

export const supabase = createClient(supabaseUrl, supabaseKey);