

import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials for better security.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseActive = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');


if (!isSupabaseActive) {
    console.warn("Supabase environment variables not set. Running in offline mode. Auth features will be disabled.");
}

// The app will initialize with placeholder values if the env vars are missing,
// preventing the crash. This allows UI development without a live backend.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);