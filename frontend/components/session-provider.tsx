/**
 * React Context for guest session management
 * Provides session data and utilities to all components
 */

'use client';

import React, { createContext, useContext } from 'react';
import { useGuestSession } from '@/hooks/use-guest-session';
import { GuestSession } from '@/lib/session';

interface SessionContextType {
  session: GuestSession | null;
  isLoading: boolean;
  sessionId: string | undefined;
  anonymousId: string | undefined;
  analyticsEnabled: boolean;
  toggleAnalytics: (enabled: boolean) => void;
  getHeaders: () => Record<string, string>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const sessionData = useGuestSession();

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Hook to use session context
 * Must be used inside SessionProvider
 */
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
