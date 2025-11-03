/**
 * Session Management for Anonymous Guests
 * Generates and manages short-lived session tokens without requiring login
 */

export interface GuestSession {
  sessionId: string;
  anonymousId: string;
  createdAt: number;
  expiresAt: number;
  analyticsEnabled: boolean;
  lastActivityAt: number;
}

const SESSION_KEY = 'museum_guest_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a cryptographically secure random ID
 */
function generateSecureId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a new guest session
 */
export function createGuestSession(): GuestSession {
  const now = Date.now();
  return {
    sessionId: generateSecureId(),
    anonymousId: generateSecureId(),
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
    analyticsEnabled: true,
    lastActivityAt: now,
  };
}

/**
 * Get or create a guest session from localStorage
 */
export function getOrCreateSession(): GuestSession {
  if (typeof window === 'undefined') {
    return createGuestSession();
  }

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    
    if (stored) {
      const session: GuestSession = JSON.parse(stored);
      
      // Check if session has expired
      if (session.expiresAt < Date.now()) {
        // Session expired, create new one
        const newSession = createGuestSession();
        localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        return newSession;
      }

      // Check for inactivity
      if (Date.now() - session.lastActivityAt > INACTIVITY_TIMEOUT) {
        session.lastActivityAt = Date.now();
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }

      return session;
    }

    // No session exists, create new one
    const newSession = createGuestSession();
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    return newSession;
  } catch (error) {
    console.error('Error managing session:', error);
    return createGuestSession();
  }
}

/**
 * Update last activity timestamp
 */
export function updateSessionActivity(): void {
  if (typeof window === 'undefined') return;

  try {
    const session = getOrCreateSession();
    session.lastActivityAt = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error updating session activity:', error);
  }
}

/**
 * Toggle analytics for current session
 */
export function setAnalyticsPreference(enabled: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    const session = getOrCreateSession();
    session.analyticsEnabled = enabled;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error updating analytics preference:', error);
  }
}

/**
 * Clear the current session (user opt-out)
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

/**
 * Get session ID for API requests
 */
export function getSessionHeader(): {
  'X-Session-Id': string;
  'X-Anonymous-Id': string;
} {
  const session = getOrCreateSession();
  return {
    'X-Session-Id': session.sessionId,
    'X-Anonymous-Id': session.anonymousId,
  };
}
