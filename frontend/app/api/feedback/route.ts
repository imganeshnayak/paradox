import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

/**
 * GET /api/feedback - Get aggregated visitor feedback
 */

export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${API_BASE}/api/feedback`;
    
    console.log(`📡 Proxying GET: ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback', details: (error as Error).message },
      { status: 500 }
    );
  }
}
