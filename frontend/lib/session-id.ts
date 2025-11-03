/**
 * Session management for anonymous users
 * Generates and persists a unique session ID in localStorage
 */

const SESSION_ID_KEY = 'museum-session-id';

/**
 * Get or create a unique session ID for this browser/device
 * @returns {string} Unique session ID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    // Generate a new session ID: UUID v4 + timestamp
    sessionId = generateUUID() + '_' + Date.now();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Generate a UUID v4
 * @returns {string} UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Clear session ID (for testing or user request)
 */
export function clearSessionId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_ID_KEY);
  }
}
