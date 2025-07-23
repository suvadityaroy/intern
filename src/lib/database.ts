import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export interface Project {
  id: string
  user_id: string
  source_type: 'github' | 'upload' | 'paste'
  repo_url?: string
  created_at: string
  status: 'scanning' | 'completed' | 'failed'
  name?: string
}

export interface File {
  id: string
  project_id: string
  path: string
  content: string
  hash: string
}

export interface Finding {
  id: string
  project_id: string
  file_id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  code_snippet: string
  line_number?: number
  created_at: string
}

export interface Fix {
  id: string
  finding_id: string
  diff: string
  created_at: string
  status: 'pending' | 'applied' | 'rejected'
}

// Database initialization
export async function initializeDatabase() {
  // Create tables if they don't exist
  const { error: projectsError } = await supabase.rpc('create_projects_table')
  const { error: filesError } = await supabase.rpc('create_files_table')
  const { error: findingsError } = await supabase.rpc('create_findings_table')
  const { error: fixesError } = await supabase.rpc('create_fixes_table')
  
  if (projectsError || filesError || findingsError || fixesError) {
    console.log('Tables may already exist or need manual creation')
  }
} 