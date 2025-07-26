import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/database'
import { GitHubService } from '@/lib/github-service'
import { VulnerabilityScanner } from '@/lib/vulnerability-scanner'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source_type, repo_url, code_content, project_name } = body

    // For demo purposes, use a default user ID
    const userId = 'demo-user'

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        source_type,
        repo_url,
        name: project_name || 'Untitled Project',
        status: 'scanning',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (projectError) {
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    let files: any[] = []

    // Handle different source types
    switch (source_type) {
      case 'github':
        if (!repo_url) {
          return NextResponse.json({ error: 'Repository URL required' }, { status: 400 })
        }
        
        const githubService = new GitHubService()
        const repoFiles = await githubService.getRepositoryFiles(repo_url)
        files = repoFiles.map(file => ({
          ...file,
          project_id: project.id,
          id: `${project.id}-${file.path}`
        }))
        break

      case 'paste':
        if (!code_content) {
          return NextResponse.json({ error: 'Code content required' }, { status: 400 })
        }
        
        const hash = createHash('md5').update(code_content).digest('hex')
        files = [{
          id: `${project.id}-pasted-code`,
          project_id: project.id,
          path: 'pasted-code.js',
          content: code_content,
          hash
        }]
        break

      case 'upload':
        // File upload handling will be done in a separate endpoint
        files = []
        break

      default:
        return NextResponse.json({ error: 'Invalid source type' }, { status: 400 })
    }

    // Store files in database
    if (files.length > 0) {
      const { error: filesError } = await supabase
        .from('files')
        .insert(files)

      if (filesError) {
        console.error('Error storing files:', filesError)
      }
    }

    // Start vulnerability scan
    if (files.length > 0) {
      const scanner = new VulnerabilityScanner()
      const findings = await scanner.scanProject(files)

      // Store findings
      if (findings.length > 0) {
        const { error: findingsError } = await supabase
          .from('findings')
          .insert(findings)

        if (findingsError) {
          console.error('Error storing findings:', findingsError)
        }
      }

      // Update project status
      await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', project.id)
    }

    return NextResponse.json({ 
      project,
      files_count: files.length,
      findings_count: files.length > 0 ? (await new VulnerabilityScanner().scanProject(files)).length : 0
    })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id') || 'demo-user'

    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        findings(count),
        files(count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json(projects)

  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 