/**
 * Artwork Data Types and Constants
 * Defines the structure for artwork metadata and content
 */

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  period: string;
  description: string;
  detailedHistory: string;
  technique: string;
  materials: string[];
  dimensions: {
    height: number;
    width: number;
    depth?: number;
    unit: 'cm' | 'in';
  };
  image: {
    url: string;
    thumbnail: string;
    alt: string;
  };
  location: {
    room: string;
    floor: number;
    coordinates?: {
      x: number;
      y: number;
    };
  };
  content: {
    videoGuides?: VideoGuide[];
    audioGuide?: AudioGuide;
    relatedArtworks?: string[]; // IDs of related artworks
  };
  metadata: {
    provenance: string;
    exhibitions: string[];
    literature: string[];
    createdAt: number;
    updatedAt: number;
  };
}

export interface VideoGuide {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  thumbnailUrl?: string;
}

export interface AudioGuide {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // in seconds
  transcript?: string;
  language: string;
}

// Sample artwork data for demonstration
export const SAMPLE_ARTWORKS: Record<string, Artwork> = {
  'artwork_001': {
    id: 'artwork_001',
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
    year: 1889,
    period: 'Post-Impressionism',
    description:
      'A swirling night sky over a village, featuring a crescent moon and stars that dominate the composition.',
    detailedHistory:
      'Painted in June 1889 while Van Gogh was at an asylum in Saint-Rémy-de-Provence, this work demonstrates his unique interpretation of the night sky through bold brushstrokes and vibrant colors.',
    technique: 'Oil on canvas with impasto technique',
    materials: ['oil paint', 'canvas'],
    dimensions: {
      height: 73.7,
      width: 92.1,
      unit: 'cm',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=200',
      alt: 'Starry Night by Van Gogh',
    },
    location: {
      room: 'Modern Art Gallery',
      floor: 2,
      coordinates: {
        x: 45,
        y: 67,
      },
    },
    content: {
      videoGuides: [
        {
          id: 'video_001',
          title: 'Understanding Starry Night',
          description: 'An in-depth look at Van Gogh\'s masterpiece and its cultural impact.',
          videoUrl: 'https://www.youtube.com/embed/e3Nl_TCQXgs',
          duration: 480,
          thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=300',
        },
      ],
      audioGuide: {
        id: 'audio_001',
        title: 'Starry Night Audio Guide',
        description: 'A guided tour through the symbolism and technique of this iconic painting.',
        audioUrl: 'https://example.com/audio/starry_night_en.mp3',
        duration: 300,
        transcript:
          'This painting, created in 1889, showcases Van Gogh\'s unique perspective on the night sky...',
        language: 'en',
      },
      relatedArtworks: ['artwork_002', 'artwork_003'],
    },
    metadata: {
      provenance: 'Museum of Modern Art, New York',
      exhibitions: ['Van Gogh in America', 'Modern Masters'],
      literature: ['Van Gogh: The Life', 'Understanding Impressionism'],
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now(),
    },
  },
  'artwork_002': {
    id: 'artwork_002',
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    year: 1931,
    period: 'Surrealism',
    description: 'A dreamlike landscape with melting clocks, representing the fluidity of time.',
    detailedHistory:
      'Created in 1931, this is one of Dalí\'s most famous works, painted while contemplating dreams and the nature of time itself.',
    technique: 'Oil on canvas',
    materials: ['oil paint', 'canvas'],
    dimensions: {
      height: 24.5,
      width: 33,
      unit: 'cm',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1578316278339-d1b1d0e13f63?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1578316278339-d1b1d0e13f63?w=200',
      alt: 'The Persistence of Memory by Dalí',
    },
    location: {
      room: 'Surrealist Dreams',
      floor: 3,
      coordinates: {
        x: 23,
        y: 45,
      },
    },
    content: {
      videoGuides: [
        {
          id: 'video_002',
          title: 'Surrealism and Time',
          description: 'Exploring the surrealist movement through Dalí\'s masterpiece.',
          videoUrl: 'https://www.youtube.com/embed/example',
          duration: 420,
        },
      ],
      audioGuide: {
        id: 'audio_002',
        title: 'The Persistence of Memory Guide',
        description: 'Understanding the symbolism behind the melting clocks.',
        audioUrl: 'https://example.com/audio/persistence_en.mp3',
        duration: 280,
        language: 'en',
      },
      relatedArtworks: ['artwork_001'],
    },
    metadata: {
      provenance: 'Museum of Modern Art, New York',
      exhibitions: ['Dalí and Dreams', 'Surrealist Visions'],
      literature: ['Dalí: The Master', 'Surrealism Explained'],
      createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now(),
    },
  },
};

/**
 * Get artwork by ID
 */
export function getArtworkById(id: string): Artwork | null {
  return SAMPLE_ARTWORKS[id] || null;
}

/**
 * Search artworks
 */
export function searchArtworks(query: string): Artwork[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(SAMPLE_ARTWORKS).filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(lowerQuery) ||
      artwork.artist.toLowerCase().includes(lowerQuery) ||
      artwork.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get artworks by location
 */
export function getArtworksByLocation(room: string): Artwork[] {
  return Object.values(SAMPLE_ARTWORKS).filter((artwork) => artwork.location.room === room);
}
