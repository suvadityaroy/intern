'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, FileText, Download, Loader2, CheckCircle } from 'lucide-react'

interface Finding {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  code_snippet: string
  line_number?: number
  created_at: string
  files: { path: string }
}

interface FindingsDashboardProps {
  projectId: string
  projectName: string
}

export function FindingsDashboard({ projectId, projectName }: FindingsDashboardProps) {
  const [findings, setFindings] = useState<Finding[]>([])
  const [loading, setLoading] = useState(true)
  const [fixLoading, setFixLoading] = useState<string | null>(null)
  const [fixes, setFixes] = useState<Record<string, unknown>>({})

  // Move fetchFindings above useEffect
  const fetchFindings = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/findings`)
      if (response.ok) {
        const data = await response.json()
        setFindings(data)
      }
    } catch (error) {
      console.error('Error fetching findings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFindings()
  }, [projectId, fetchFindings])

  const handleRequestFix = async (findingId: string) => {
    setFixLoading(findingId)
    
    try {
      const response = await fetch(`/api/findings/${findingId}/fix`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        setFixes(prev => ({
          ...prev,
          [findingId]: data
        }))
      }
    } catch (error) {
      console.error('Error generating fix:', error)
    } finally {
      setFixLoading(null)
    }
  }

  // Update downloadFix to type guard fix
  const downloadFix = (findingId: string) => {
    const fix = fixes[findingId]
    if (!fix || typeof fix !== 'object' || fix === null || !('diff' in fix)) return
    const diff = (fix as { diff: string }).diff
    const blob = new Blob([diff], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fix-${findingId}.diff`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'critical'
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'default'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const severityCounts = findings.reduce((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading findings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{projectName}</h1>
          <p className="text-muted-foreground">Vulnerability Analysis Results</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">
            {findings.length} Findings
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="critical">{severityCounts.critical || 0}</Badge>
              <span className="text-sm font-medium">Critical</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="high">{severityCounts.high || 0}</Badge>
              <span className="text-sm font-medium">High</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="medium">{severityCounts.medium || 0}</Badge>
              <span className="text-sm font-medium">Medium</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="low">{severityCounts.low || 0}</Badge>
              <span className="text-sm font-medium">Low</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Findings List */}
      {findings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Vulnerabilities Found!</h3>
            <p className="text-muted-foreground">
              Great job! Your code appears to be secure.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {findings.map((finding) => (
            <Card key={finding.id} className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(finding.severity)}
                    <div>
                      <CardTitle className="text-lg">{finding.message}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <FileText className="h-3 w-3" />
                        {finding.files?.path}
                        {finding.line_number && (
                          <>
                            <span>•</span>
                            <span>Line {finding.line_number}</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getSeverityColor(finding.severity) as 'low' | 'medium' | 'high' | 'critical' | 'default'}>
                    {finding.severity}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Code Snippet */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Vulnerable Code:</h4>
                  <pre className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                    <code>{finding.code_snippet}</code>
                  </pre>
                </div>

                {/* Fix Section */}
                {fixes[finding.id] && typeof fixes[finding.id] === 'object' && fixes[finding.id] !== null && 'fixed_code' in fixes[finding.id] ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Generated Fix:</h4>
                    <pre className="bg-green-50 border border-green-200 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <code>{(fixes[finding.id] as { fixed_code: string }).fixed_code}</code>
                    </pre>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => downloadFix(finding.id)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Fix
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRequestFix(finding.id)}
                      disabled={fixLoading === finding.id}
                      className="flex items-center gap-2"
                    >
                      {fixLoading === finding.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Request Fix
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 