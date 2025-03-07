
// We're transitioning to use the client from @/integrations/supabase/client
// This file is kept for backward compatibility until all imports are updated
import { supabase as supabaseClient } from '@/integrations/supabase/client';

export const supabase = supabaseClient;
