import { buildSearchRecords } from '@/lib/search-index'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json(buildSearchRecords())
}
