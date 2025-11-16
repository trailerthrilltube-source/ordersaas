import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseCredentials';

// The app will use the credentials from lib/supabaseCredentials.ts
// PLEASE UPDATE THE PLACEHOLDER VALUES IN THAT FILE.
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

export const isSupabaseActive = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key');

if (!isSupabaseActive) {
    console.warn("Supabase credentials not set in lib/supabaseCredentials.ts. Running in offline mode. Auth features will be disabled.");
}

// The app will initialize with the credentials from the credentials file.
// If they are not set, it will use placeholder values to prevent crashing.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
