import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

/**
 * Proxy all review endpoints to backend
 * 
 * GET /api/reviews/[id]/reviews - Get reviews for artwork
 * GET /api/reviews/[id]/like/check - Check like status
 * POST /api/reviews/[id]/reviews - Submit review
 * POST /api/reviews/[id]/like - Toggle like
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    
    // Reconstruct the backend URL path from the request path
    // /api/reviews/[id]/reviews → /api/reviews/[id]/reviews
    // /api/reviews/[id]/like/check → /api/reviews/[id]/like/check?...
    
    const backendUrl = `${API_BASE}/api/reviews/${id}${url.pathname.replace(/\/api\/reviews\/[^\/]+/, '')}${url.search}`;
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const url = new URL(request.url);

    // Reconstruct the backend URL path
    const backendUrl = `${API_BASE}/api/reviews/${id}${url.pathname.replace(/\/api\/reviews\/[^\/]+/, '')}`;
    
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
