import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/database'
export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const { params } = context;
  try {
    const { data: findings, error } = await supabase
      .from('findings')
      .select(`
        *,
        files(path)
      `)
      .eq('project_id', params.id)
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch findings' }, { status: 500 })
    }

    return NextResponse.json(findings)

  } catch (error) {
    console.error('Error fetching findings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 