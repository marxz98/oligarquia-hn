// ═══════════════════════════════════════════════════════════
// SUPABASE — Client configuration
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://iluxqfacmnadjnilkcpu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PEgKMwk0GJ_UilFELzKl7A_9TJqVdhf';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function handleError(error, context) {
  console.error(`[Supabase] Error en ${context}:`, error.message);
  return null;
}
