// ═══════════════════════════════════════════════════════════
// SUPABASE — Client configuration
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://iluxqfacmnadjnilkcpu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdXhxZmFjbW5hZGpuaWxrY3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTQzMjQsImV4cCI6MjA4ODIzMDMyNH0.ZL_uc9214eQP9bBulfTtVVIM6Th9JaGjFj-Uw1qSztY';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
