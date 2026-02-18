
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://icglkflfwipsjpvyxytf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZ2xrZmxmd2lwc2pwdnl4eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDkyNDYsImV4cCI6MjA4NjcyNTI0Nn0.GXO_6L1h6_FnSGSjLAqvbdFsFQn2IagBBmyXOkVFA1Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
