/**
 * React hook for fetching and managing artwork data
 */

import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { Artwork } from '@/lib/artwork-data';

interface UseArtworkResult {
  artwork: Artwork | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch single artwork by ID
 */
export function useArtwork(artworkId: string | null): UseArtworkResult {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtwork = useCallback(async () => {
    if (!artworkId) {
      setArtwork(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await apiClient.get<Artwork>(`/artworks/${artworkId}`);

    if (response.success && response.data) {
      setArtwork(response.data);
    } else {
      setError(response.error || 'Failed to fetch artwork');
      setArtwork(null);
    }

    setIsLoading(false);
  }, [artworkId]);

  useEffect(() => {
    fetchArtwork();
  }, [fetchArtwork]);

  return {
    artwork,
    isLoading,
    error,
    refetch: fetchArtwork,
  };
}

interface UseSearchResult {
  results: Artwork[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => void;
  searchByLocation: (location: string) => void;
}

/**
 * Hook for searching artworks
 */
export function useArtworkSearch(): UseSearchResult {
  const [results, setResults] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await apiClient.get<{ results: Artwork[]; count: number }>(
      `/artworks/search?query=${encodeURIComponent(query)}`
    );

    if (response.success && response.data) {
      setResults(response.data.results);
    } else {
      setError(response.error || 'Search failed');
      setResults([]);
    }

    setIsLoading(false);
  }, []);

  const searchByLocation = useCallback(async (location: string) => {
    if (!location.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await apiClient.get<{ results: Artwork[]; count: number }>(
      `/artworks/search?location=${encodeURIComponent(location)}`
    );

    if (response.success && response.data) {
      setResults(response.data.results);
    } else {
      setError(response.error || 'Search failed');
      setResults([]);
    }

    setIsLoading(false);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    searchByLocation,
  };
}
