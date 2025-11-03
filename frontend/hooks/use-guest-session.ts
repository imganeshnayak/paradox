/**
 * React hook for managing guest sessions
 */

import { useEffect, useState, useCallback } from 'react';
import {
  getOrCreateSession,
  updateSessionActivity,
  setAnalyticsPreference as setAnalyticsPref,
  getSessionHeader,
  GuestSession,
} from '@/lib/session';

export function useGuestSession() {
  const [session, setSession] = useState<GuestSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initSession = () => {
      const guestSession = getOrCreateSession();
      setSession(guestSession);
      setIsLoading(false);
    };

    initSession();
  }, []);

  // Update activity on user interactions
  useEffect(() => {
    if (!session) return;

    const handleActivity = () => {
      updateSessionActivity();
      setSession(getOrCreateSession());
    };

    // Track various user activities
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [session]);

  const toggleAnalytics = useCallback((enabled: boolean) => {
    setAnalyticsPref(enabled);
    setSession(getOrCreateSession());
  }, []);

  const getHeaders = useCallback(() => getSessionHeader(), []);

  return {
    session,
    isLoading,
    toggleAnalytics,
    getHeaders,
    sessionId: session?.sessionId,
    anonymousId: session?.anonymousId,
    analyticsEnabled: session?.analyticsEnabled ?? true,
  };
}
