
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://brcqkkcizzlyqkhuznjo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyY3Fra2NpenpseXFraHV6bmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0Mzc5MjksImV4cCI6MjA4NzAxMzkyOX0.Rl9XFC7pPH7Ey3hSpBVRTvs-aIWhQjCZW2BXU__jmDc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
