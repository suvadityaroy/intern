'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, Upload, FileText, Loader2 } from 'lucide-react'
import { Project } from '@/lib/database'

interface CodeIntakeProps {
  onProjectCreated: (project: Project) => void
}

export function CodeIntake({ onProjectCreated }: CodeIntakeProps) {
  const [activeTab, setActiveTab] = useState<'github' | 'upload' | 'paste'>('github')
  const [loading, setLoading] = useState(false)
  const [repoUrl, setRepoUrl] = useState('')
  const [codeContent, setCodeContent] = useState('')
  const [projectName, setProjectName] = useState('')

  const tabs = [
    { id: 'github', label: 'GitHub Repository', icon: Github },
    { id: 'upload', label: 'Upload Files', icon: Upload },
    { id: 'paste', label: 'Paste Code', icon: FileText },
  ] as const

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_type: activeTab,
          repo_url: activeTab === 'github' ? repoUrl : undefined,
          code_content: activeTab === 'paste' ? codeContent : undefined,
          project_name: projectName || 'Untitled Project',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const result = await response.json()
      onProjectCreated(result.project)
      
      // Reset form
      setRepoUrl('')
      setCodeContent('')
      setProjectName('')
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isValidForm = () => {
    switch (activeTab) {
      case 'github':
        return repoUrl.trim() !== ''
      case 'paste':
        return codeContent.trim() !== ''
      case 'upload':
        return true // File upload will be handled separately
      default:
        return false
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          CodeSecure - Vulnerability Scanner
        </CardTitle>
        <CardDescription>
          AI-generated code ships fast—and often ships vulnerable. CodeSecure aims to give founders a one-click layer that scans their repos, flags weaknesses, and offers instant fixes so they can ship with confidence.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Project Name Input */}
        <div className="space-y-2">
          <label htmlFor="project-name" className="text-sm font-medium">
            Project Name
          </label>
          <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'github' && (
          <div className="space-y-2">
            <label htmlFor="repo-url" className="text-sm font-medium">
              GitHub Repository URL
            </label>
            <input
              id="repo-url"
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Enter a public GitHub repository URL to scan for vulnerabilities
            </p>
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="space-y-2">
            <label htmlFor="code-content" className="text-sm font-medium">
              Paste Your Code
            </label>
            <textarea
              id="code-content"
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder="Paste your code here..."
              rows={10}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Paste your code directly for instant vulnerability analysis
            </p>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Upload Files
            </label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: .js, .ts, .py, .java, .cpp, .php, etc.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              File upload functionality coming soon
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isValidForm() || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            'Start Vulnerability Scan'
          )}
        </Button>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <Badge variant="high" className="mb-2">AI-Powered</Badge>
            <p className="text-xs text-muted-foreground">
              Advanced pattern recognition for security vulnerabilities
            </p>
          </div>
          <div className="text-center">
            <Badge variant="medium" className="mb-2">Fast</Badge>
            <p className="text-xs text-muted-foreground">
              Complete scan in under 10 minutes
            </p>
          </div>
          <div className="text-center">
            <Badge variant="low" className="mb-2">Instant Fixes</Badge>
            <p className="text-xs text-muted-foreground">
              Get actionable fixes for each vulnerability
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 