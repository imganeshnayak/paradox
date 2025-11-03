/**
 * Consent Banner Component
 * Displays privacy and consent information to users
 */

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Settings } from 'lucide-react';
import {
  getConsentPreferences,
  setConsentPreferences,
  acceptAllCookies,
  rejectAllCookies,
  shouldShowConsentBanner,
  getPrivacyPolicyText,
} from '@/lib/consent';

interface ConsentBannerProps {
  onConsent?: (accepted: boolean) => void;
}

export function ConsentBanner({ onConsent }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    if (shouldShowConsentBanner()) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
    onConsent?.(true);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setIsVisible(false);
    onConsent?.(false);
  };

  const handleSavePreferences = () => {
    setConsentPreferences({
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      preferences: preferences.preferences,
      necessaryOnly: false,
    });
    setIsVisible(false);
    onConsent?.(preferences.analytics);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto bg-white p-6 shadow-2xl sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md rounded-lg">
        {/* Close button */}
        <button
          onClick={handleRejectAll}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close consent banner"
        >
          <X size={20} />
        </button>

        {!showDetails ? (
          <div className="space-y-4">
            {/* Header */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Privacy & Data Protection</h2>
              <p className="mt-2 text-sm text-gray-600">
                We collect anonymous data about your museum experience to improve navigation and
                content. Your privacy is important to us.
              </p>
            </div>

            {/* Key points */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>No personal information is collected</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Your session expires after 24 hours</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>You can opt-out anytime</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-4">
              <Button
                onClick={handleAcceptAll}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Accept All
              </Button>

              <Button
                onClick={handleRejectAll}
                variant="outline"
                className="w-full"
              >
                Reject Non-Essential
              </Button>

              <Button
                onClick={() => setShowDetails(true)}
                variant="ghost"
                className="w-full gap-2"
              >
                <Settings size={16} />
                Customize
              </Button>
            </div>

            {/* Privacy policy link */}
            <button
              onClick={() => setShowDetails(true)}
              className="text-xs text-primary hover:underline"
            >
              Read our privacy policy
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Back button */}
            <button
              onClick={() => setShowDetails(false)}
              className="text-sm text-primary hover:underline mb-4"
            >
              ← Back
            </button>

            {/* Title */}
            <h3 className="text-base font-semibold text-gray-900">Customize Preferences</h3>

            {/* Toggle options */}
            <div className="space-y-3">
              {/* Necessary */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                <div>
                  <p className="font-medium text-sm text-gray-900">Necessary Cookies</p>
                  <p className="text-xs text-gray-600">Always enabled for security</p>
                </div>
                <input
                  type="checkbox"
                  disabled
                  checked
                  className="rounded"
                />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                <div>
                  <p className="font-medium text-sm text-gray-900">Analytics</p>
                  <p className="text-xs text-gray-600">Artwork viewing patterns and dwell time</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="rounded cursor-pointer"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                <div>
                  <p className="font-medium text-sm text-gray-900">Marketing</p>
                  <p className="text-xs text-gray-600">Personalized recommendations</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="rounded cursor-pointer"
                />
              </div>

              {/* Preferences */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                <div>
                  <p className="font-medium text-sm text-gray-900">Preferences</p>
                  <p className="text-xs text-gray-600">Remember your display settings</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) =>
                    setPreferences({ ...preferences, preferences: e.target.checked })
                  }
                  className="rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-4">
              <Button
                onClick={handleSavePreferences}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Save Preferences
              </Button>

              <Button
                onClick={handleRejectAll}
                variant="outline"
                className="w-full"
              >
                Reject All
              </Button>
            </div>

            {/* Privacy info */}
            <div className="text-xs text-gray-600 space-y-2 pt-4 border-t">
              <p>
                <strong>Session Data:</strong> Automatically deleted after 24 hours
              </p>
              <p>
                <strong>Your Rights:</strong> You can change these settings anytime in the footer
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
