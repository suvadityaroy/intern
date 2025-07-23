import { Octokit } from '@octokit/rest'
import { File } from './database'

export class GitHubService {
  private octokit: Octokit

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    })
  }

  async getRepositoryFiles(repoUrl: string): Promise<File[]> {
    const { owner, repo } = this.parseRepoUrl(repoUrl)
    const files: File[] = []

    try {
      // Get repository tree
      const { data: tree } = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: 'main', // or 'master'
        recursive: 'true',
      })

      // Filter for code files
      const codeFiles = tree.tree.filter(item => 
        item.type === 'blob' && 
        this.isCodeFile(item.path || '')
      )

      // Fetch content for each file
      for (const file of codeFiles.slice(0, 50)) { // Limit to 50 files for performance
        try {
          const { data: content } = await this.octokit.repos.getContent({
            owner,
            repo,
            path: file.path!,
          })

          if ('content' in content && content.content) {
            const decodedContent = Buffer.from(content.content, 'base64').toString('utf-8')
            
            files.push({
              id: `${owner}-${repo}-${file.path}`,
              project_id: '', // Will be set by caller
              path: file.path!,
              content: decodedContent,
              hash: file.sha || '',
            })
          }
        } catch {
          console.warn(`Failed to fetch content for ${file.path}`)
        }
      }

      return files
    } catch {
      console.error('Error fetching repository files')
      throw new Error('Failed to fetch repository files')
    }
  }

  private parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
    // Handle different GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /github\.com\/([^\/]+)\/([^\/]+)\.git/,
    ]

    for (const pattern of patterns) {
      const match = repoUrl.match(pattern)
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace('.git', ''),
        }
      }
    }

    throw new Error('Invalid GitHub repository URL')
  }

  private isCodeFile(filename: string): boolean {
    const codeExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs',
      '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.clj',
      '.html', '.css', '.scss', '.sass', '.less', '.vue', '.svelte',
      '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.cfg',
      '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat',
      '.sql', '.r', '.m', '.matlab', '.julia', '.dart'
    ]

    return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext))
  }

  async validateRepository(repoUrl: string): Promise<boolean> {
    try {
      const { owner, repo } = this.parseRepoUrl(repoUrl)
      await this.octokit.repos.get({ owner, repo })
      return true
    } catch {
      return false
    }
  }

  async getRepositoryInfo(repoUrl: string): Promise<{
    name: string
    description: string
    language: string
    size: number
  }> {
    const { owner, repo } = this.parseRepoUrl(repoUrl)
    
    try {
      const { data } = await this.octokit.repos.get({ owner, repo })
      
      return {
        name: data.name,
        description: data.description || '',
        language: data.language || 'Unknown',
        size: data.size,
      }
    } catch {
      throw new Error('Failed to get repository information')
    }
  }
} 