/**
 * API Route: Get Artwork Details
 * Endpoint: GET /api/artworks/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById } from '@/lib/artwork-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artworkId = params.id;

    if (!artworkId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Artwork ID is required',
        },
        { status: 400 }
      );
    }

    const artwork = getArtworkById(artworkId);

    if (!artwork) {
      return NextResponse.json(
        {
          success: false,
          error: 'Artwork not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: artwork,
    });
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch artwork',
      },
      { status: 500 }
    );
  }
}
