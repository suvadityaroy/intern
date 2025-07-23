'use client'

import { useState, useEffect } from 'react'
import { CodeIntake } from '@/components/code-intake'
import { FindingsDashboard } from '@/components/findings-dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, History, Shield, ArrowUp, Sparkles, Zap, Lock, Github } from 'lucide-react'

interface Project {
  id: string
  name: string
  source_type: string
  status: string
  created_at: string
  findings: { count: number }[]
  files: { count: number }[]
}

export default function Home() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    fetchProjects()
    const onScroll = () => setShowScroll(window.scrollY > 200)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (project: Project) => {
    setCurrentProject(project)
    fetchProjects() // Refresh the projects list
  }

  const handleBackToProjects = () => {
    setCurrentProject(null)
  }

  const handleNewScan = () => {
    setCurrentProject(null)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (currentProject) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToProjects}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </div>
          
          <FindingsDashboard
            projectId={currentProject.id}
            projectName={currentProject.name}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center pt-16 pb-10 text-center animate-fade-in-slow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-10 w-10 text-yellow-300 animate-spin-slow" />
            CodeSecure
          </h1>
          <p className="text-lg md:text-2xl text-white/80 font-medium mb-8">
            AI-powered vulnerability scanner that helps you ship secure code with confidence.
          </p>
          <Button
            size="lg"
            className="px-8 py-4 text-lg font-bold shadow-xl animate-bounce bg-gradient-to-r from-blue-500 to-cyan-400 border-0"
            onClick={() => document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Zap className="h-5 w-5 mr-2 animate-pulse" />
            Start Free Scan
          </Button>
          <div className="flex justify-center gap-4 mt-6">
            <a href="https://github.com/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <Github className="h-4 w-4" /> View on GitHub
            </a>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Features Section */}
      <section id="features" className="w-full max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-4 mb-16 animate-fade-in-slow">
        <Card className="glass card text-center p-6">
          <CardHeader>
            <Shield className="h-8 w-8 mx-auto text-blue-400 mb-2 animate-pulse" />
            <CardTitle>AI-Powered Analysis</CardTitle>
            <CardDescription>Advanced pattern recognition detects SQL injection, XSS, hardcoded secrets, and more.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="glass card text-center p-6">
          <CardHeader>
            <Zap className="h-8 w-8 mx-auto text-cyan-400 mb-2 animate-bounce" />
            <CardTitle>Instant Fixes</CardTitle>
            <CardDescription>Get actionable fixes for each vulnerability with downloadable patches.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="glass card text-center p-6">
          <CardHeader>
            <Lock className="h-8 w-8 mx-auto text-purple-400 mb-2 animate-spin-slow" />
            <CardTitle>Multiple Sources</CardTitle>
            <CardDescription>Connect GitHub repos, upload files, or paste code directly for analysis.</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <div className="section-divider" />

      {/* Code Intake Section */}
      <section id="intake" className="w-full max-w-2xl mx-auto mb-16 animate-fade-in-slow">
        <CodeIntake onProjectCreated={handleProjectCreated} />
      </section>

      {/* Recent Projects Section */}
      <section className="w-full max-w-4xl mx-auto mb-16 animate-fade-in-slow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
            <History className="h-6 w-6" />
            Recent Scans
          </h2>
          <Button
            onClick={handleNewScan}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Scan
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-2 text-white/70">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="glass card">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">No scans yet</h3>
              <p className="text-muted-foreground">
                Start your first vulnerability scan above to see your projects here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="glass card cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={() => setCurrentProject(project)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 text-white/90">{project.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {project.source_type}
                          </Badge>
                        </span>
                        <span>{project.files?.[0]?.count || 0} files</span>
                        <span>{project.findings?.[0]?.count || 0} findings</span>
                        <span>
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          project.status === 'completed' ? 'low' :
                          project.status === 'scanning' ? 'medium' :
                          'high'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
