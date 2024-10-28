import { deleteSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse<null>> {
  deleteSession()

  return new NextResponse(null, { status: 204 })
}