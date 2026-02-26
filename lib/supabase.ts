
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwqolaoodqknwakouhgg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cW9sYW9vZHFrbndha291aGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTY3OTQsImV4cCI6MjA4NzY3Mjc5NH0.xIuH1EftwClvGuB45N5_KsK2WxwtGXuBs6_U7KLYOIY';


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
