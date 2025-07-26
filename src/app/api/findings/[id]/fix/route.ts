import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/database'
import { VulnerabilityScanner } from '@/lib/vulnerability-scanner'

export async function POST(
  request: NextRequest,
  context: { params: Record<string, string> }
) {
  const { params } = context;
  try {
    // Get the finding
    const { data: finding, error: findingError } = await supabase
      .from('findings')
      .select('*')
      .eq('id', params.id)
      .single()

    if (findingError || !finding) {
      return NextResponse.json({ error: 'Finding not found' }, { status: 404 })
    }

    // Generate fix
    const scanner = new VulnerabilityScanner()
    const fixedCode = await scanner.generateFix(finding)

    // Create diff
    const diff = generateDiff(finding.code_snippet, fixedCode)

    // Store the fix
    const { data: fix, error: fixError } = await supabase
      .from('fixes')
      .insert({
        finding_id: params.id,
        diff,
        created_at: new Date().toISOString(),
        status: 'pending'
      })
      .select()
      .single()

    if (fixError) {
      return NextResponse.json({ error: 'Failed to create fix' }, { status: 500 })
    }

    return NextResponse.json({
      fix,
      original_code: finding.code_snippet,
      fixed_code: fixedCode,
      diff
    })

  } catch (error) {
    console.error('Error generating fix:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateDiff(original: string, fixed: string): string {
  const originalLines = original.split('\n')
  const fixedLines = fixed.split('\n')
  
  let diff = ''
  
  for (let i = 0; i < Math.max(originalLines.length, fixedLines.length); i++) {
    const originalLine = originalLines[i] || ''
    const fixedLine = fixedLines[i] || ''
    
    if (originalLine !== fixedLine) {
      diff += `- ${originalLine}\n`
      diff += `+ ${fixedLine}\n`
    } else {
      diff += `  ${originalLine}\n`
    }
  }
  
  return diff
} 