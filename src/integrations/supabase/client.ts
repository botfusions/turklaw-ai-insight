
/**
 * TurkLawAI Standalone Authentication Client
 * Replaces Supabase with JWT-based authentication via Netlify Functions
 */

// Import standalone auth client
import { supabase as standaloneSupabase } from '@/integrations/standalone/client';

// Re-export as the main supabase client
export const supabase = standaloneSupabase;

// For backward compatibility with any direct imports
export default supabase;
