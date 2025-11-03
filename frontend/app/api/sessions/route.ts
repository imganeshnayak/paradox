/**
 * API route: Validate and manage guest sessions
 * Endpoint: POST /api/sessions
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get('X-Session-Id');
    const anonymousId = request.headers.get('X-Anonymous-Id');

    if (!sessionId || !anonymousId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing session headers',
        },
        { status: 400 }
      );
    }

    // Validate format (basic check)
    if (!/^[a-f0-9]{32}$/.test(sessionId) || !/^[a-f0-9]{32}$/.test(anonymousId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid session format',
        },
        { status: 400 }
      );
    }

    // TODO: Store session in database if needed
    // For now, just validate and return success

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        anonymousId,
        validatedAt: Date.now(),
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Session validation failed',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check session status
 */
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('X-Session-Id');
    const anonymousId = request.headers.get('X-Anonymous-Id');

    if (!sessionId || !anonymousId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing session headers',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        anonymousId,
        status: 'active',
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Session check failed',
      },
      { status: 500 }
    );
  }
}
