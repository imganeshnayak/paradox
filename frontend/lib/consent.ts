/**
 * Privacy & Consent Management
 * Handles user consent for analytics and data collection
 */

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  necessaryOnly: boolean;
  lastUpdated: number;
  version: number;
}

const CONSENT_KEY = 'museum_consent_preferences';
const CONSENT_VERSION = 1;
const CONSENT_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 1 year

/**
 * Get user's consent preferences
 */
export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === 'undefined') {
    return getDefaultPreferences();
  }

  try {
    const stored = localStorage.getItem(CONSENT_KEY);

    if (stored) {
      const preferences: ConsentPreferences = JSON.parse(stored);

      // Check if consent is still valid
      if (preferences.lastUpdated + CONSENT_EXPIRY > Date.now()) {
        return preferences;
      }
    }
  } catch (error) {
    console.error('Error reading consent preferences:', error);
  }

  return getDefaultPreferences();
}

/**
 * Get default consent preferences (all disabled until user accepts)
 */
export function getDefaultPreferences(): ConsentPreferences {
  return {
    analytics: false,
    marketing: false,
    preferences: false,
    necessaryOnly: true,
    lastUpdated: Date.now(),
    version: CONSENT_VERSION,
  };
}

/**
 * Save user's consent preferences
 */
export function setConsentPreferences(preferences: Partial<ConsentPreferences>): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getConsentPreferences();
    const updated: ConsentPreferences = {
      ...current,
      ...preferences,
      lastUpdated: Date.now(),
      version: CONSENT_VERSION,
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(updated));

    // Update analytics based on consent
    updateAnalyticsConsent(updated.analytics);

    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent('consent-updated', {
        detail: updated,
      })
    );
  } catch (error) {
    console.error('Error saving consent preferences:', error);
  }
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  setConsentPreferences({
    analytics: true,
    marketing: true,
    preferences: true,
    necessaryOnly: false,
  });
}

/**
 * Reject all non-necessary cookies
 */
export function rejectAllCookies(): void {
  setConsentPreferences({
    analytics: false,
    marketing: false,
    preferences: false,
    necessaryOnly: true,
  });
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  const preferences = getConsentPreferences();
  return preferences.analytics && !preferences.necessaryOnly;
}

/**
 * Update analytics tracking based on consent
 */
function updateAnalyticsConsent(enabled: boolean): void {
  if (typeof window === 'undefined') return;

  // Dispatch event for analytics manager to listen to
  window.dispatchEvent(
    new CustomEvent('analytics-consent-changed', {
      detail: { enabled },
    })
  );
}

/**
 * Withdraw consent
 */
export function withdrawConsent(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new CustomEvent('consent-withdrawn'));
  } catch (error) {
    console.error('Error withdrawing consent:', error);
  }
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowConsentBanner(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return !stored; // Show if no preferences saved
  } catch {
    return true;
  }
}

/**
 * Get privacy policy text
 */
export function getPrivacyPolicyText(): string {
  return `
# Privacy Policy

## 1. Anonymous Data Collection
We collect anonymous data about your interactions with artworks to help museums understand visitor engagement. This data:
- Does NOT include personally identifiable information (PII)
- Is associated with a random session ID, not your user account
- Expires after 24 hours of inactivity

## 2. What Data We Collect
- Which artworks you scan/view
- How long you spend on each artwork (dwell time)
- Which audio guides and videos you play
- Your navigation patterns through the museum
- Basic device information (screen size, browser type)

## 3. How We Use Your Data
- Understand which artworks attract visitors
- Improve museum navigation and wayfinding
- Optimize content recommendations
- Generate aggregate analytics reports for museum staff

## 4. Your Rights
- You can opt-out of analytics at any time
- You can request deletion of your session data
- We do NOT sell your data to third parties
- Your data is never shared with advertisers

## 5. Data Security
- All data is transmitted over HTTPS
- Analytics data is stored securely
- Access is restricted to authorized museum staff only

## 6. Contact
If you have privacy concerns, please contact the museum directly.
`;
}

/**
 * Get cookie information text
 */
export function getCookieInfoText(): string {
  return `
## Cookie Types

### Necessary Cookies
- Museum session ID
- CSRF tokens for security
- Language preference

### Analytics Cookies
- Visitor interaction tracking
- Engagement metrics
- Session analytics

### Marketing Cookies
- Future: Promotional emails (optional)

### Preference Cookies
- Your consent choices
- Display preferences
`;
}
