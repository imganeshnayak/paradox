/**
 * API Route: Analytics Events Proxy
 * Endpoint: POST /api/analytics/events
 * Forwards analytics events to the backend
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No events provided',
        },
        { status: 400 }
      );
    }

    console.log(`📡 Forwarding ${events.length} analytics events to backend...`);
    events.forEach((event: any) => {
      console.log(`  - ${event.eventType} on artwork: ${event.artworkId}`);
    });

    // Forward to backend
    const response = await fetch(`${backendUrl}/api/analytics/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Backend error: ${response.status}`);
      return NextResponse.json(data, { status: response.status });
    }

    console.log(`✅ Analytics recorded: ${JSON.stringify(data)}`);
    return NextResponse.json({
      success: true,
      data: {
        eventsReceived: events.length,
        backendResponse: data,
      },
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track analytics',
      },
      { status: 500 }
    );
  }
}
