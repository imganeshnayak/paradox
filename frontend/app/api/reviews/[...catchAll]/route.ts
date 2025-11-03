import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

/**
 * Catch-all proxy for nested review endpoints
 * Handles paths like:
 * - /api/reviews/[id]/reviews
 * - /api/reviews/[id]/like
 * - /api/reviews/[id]/like/check
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ catchAll: string[] }> }
) {
  try {
    const catchAllParams = await params;
    const catchAll = catchAllParams.catchAll || [];
    
    // Reconstruct full path: [id]/reviews or [id]/like/check, etc
    const fullPath = catchAll.join('/');
    
    const url = new URL(request.url);
    const backendUrl = `${API_BASE}/api/reviews/${fullPath}${url.search}`;
    
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
    console.error('Reviews API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ catchAll: string[] }> }
) {
  try {
    const catchAllParams = await params;
    const catchAll = catchAllParams.catchAll || [];
    const body = await request.json();

    // Reconstruct full path
    const fullPath = catchAll.join('/');
    
    const url = new URL(request.url);
    const backendUrl = `${API_BASE}/api/reviews/${fullPath}`;
    
    console.log(`📡 Proxying POST: ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Reviews API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: (error as Error).message },
      { status: 500 }
    );
  }
}
