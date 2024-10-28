import { NextRequest, NextResponse } from 'next/server'
import {
  ErrorResponse,
  checkCredentials,
  CheckCredentialsResponse,
} from '@/lib/handlers'
import { createSession } from '@/lib/auth'

export async function POST(
  request: NextRequest
): Promise<
  NextResponse<CheckCredentialsResponse> | NextResponse<ErrorResponse>
> {
  const body = await request.json()

  if (!body.email || !body.password) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Request parameters are wrong or missing.',
      },
      { status: 400 }
    )
  }

  const userId = await checkCredentials(body.email, body.password)

  if (userId === null) {
    return NextResponse.json(
      {
        error: 'WRONG_CREDENTIALS',
        message: 'Wrong e-mail address or password.',
      },
      { status: 400 }
    )
  }

  await createSession({ userId: userId._id.toString() })

  return NextResponse.json(userId, { status: 200 })
}