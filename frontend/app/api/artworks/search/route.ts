/**
 * API Route: Search Artworks
 * Endpoint: GET /api/artworks/search?query=...
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchArtworks, getArtworksByLocation, Artwork } from '@/lib/artwork-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const location = searchParams.get('location');

    if (!query && !location) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query or location parameter is required',
        },
        { status: 400 }
      );
    }

    let results: Artwork[] = [];

    if (location) {
      results = getArtworksByLocation(location);
    } else if (query) {
      results = searchArtworks(query);
    }

    return NextResponse.json({
      success: true,
      data: {
        results,
        count: results.length,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
      },
      { status: 500 }
    );
  }
}
