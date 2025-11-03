/**
 * Anonymous Analytics Tracking
 * Tracks user interactions without storing PII
 */

import { getOrCreateSession } from '@/lib/session';
import { apiClient } from '@/lib/api-client';

export interface AnalyticsEvent {
  eventType:
    | 'scan'
    | 'view'
    | 'dwell_time'
    | 'click'
    | 'video_play'
    | 'audio_play'
    | 'navigation';
  artworkId?: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

class AnalyticsManager {
  private eventQueue: AnalyticsEvent[] = [];
  private pageStartTime: number = Date.now();
  private currentArtworkId: string | null = null;
  private artworkStartTime: number = 0;

  constructor() {
    this.setupPageTracking();
  }

  /**
   * Track custom event
   */
  async trackEvent(
    eventType: AnalyticsEvent['eventType'],
    artworkId?: string,
    data?: Record<string, unknown>
  ) {
    const session = getOrCreateSession();

    if (!session.analyticsEnabled) {
      return;
    }

    const event: AnalyticsEvent = {
      eventType,
      artworkId,
      data,
      timestamp: Date.now(),
    };

    this.eventQueue.push(event);

    // Send immediately if queue is getting large, otherwise batch
    if (this.eventQueue.length >= 10) {
      await this.flush();
    }
  }

  /**
   * Track artwork view start
   */
  trackArtworkStart(artworkId: string) {
    // End previous artwork tracking if any
    if (this.currentArtworkId) {
      this.trackArtworkDwellTime();
    }

    this.currentArtworkId = artworkId;
    this.artworkStartTime = Date.now();
    this.trackEvent('view', artworkId);
  }

  /**
   * Track dwell time on current artwork
   */
  private trackArtworkDwellTime() {
    if (!this.currentArtworkId) return;

    const dwellTime = Date.now() - this.artworkStartTime;
    this.trackEvent('dwell_time', this.currentArtworkId, {
      seconds: Math.round(dwellTime / 1000),
    });

    this.currentArtworkId = null;
  }

  /**
   * Track click/interaction
   */
  trackClick(artworkId?: string, target?: string) {
    this.trackEvent('click', artworkId, {
      target,
    });
  }

  /**
   * Track video playback
   */
  trackVideoPlay(artworkId: string, videoId: string) {
    this.trackEvent('video_play', artworkId, {
      videoId,
    });
  }

  /**
   * Track audio guide play
   */
  trackAudioPlay(artworkId: string, audioId: string) {
    this.trackEvent('audio_play', artworkId, {
      audioId,
    });
  }

  /**
   * Track navigation
   */
  trackNavigation(source: string, destination: string) {
    this.trackEvent('navigation', undefined, {
      source,
      destination,
    });
  }

  /**
   * Flush queued events to backend
   */
  async flush() {
    if (this.eventQueue.length === 0) return;

    const session = getOrCreateSession();
    if (!session.analyticsEnabled) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await apiClient.post('/analytics/events', {
        events: eventsToSend,
        sessionId: session.sessionId,
        anonymousId: session.anonymousId,
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to queue if send failed
      this.eventQueue = [...eventsToSend, ...this.eventQueue];
    }
  }

  /**
   * Setup page-level tracking
   */
  private setupPageTracking() {
    // Flush events before page unload
    window.addEventListener('beforeunload', () => {
      this.trackArtworkDwellTime();
      this.flush();
    });

    // Periodic flush
    setInterval(() => {
      this.flush();
    }, 30000); // Every 30 seconds
  }

  /**
   * Get analytics status
   */
  getStatus() {
    const session = getOrCreateSession();
    return {
      enabled: session.analyticsEnabled,
      queuedEvents: this.eventQueue.length,
      sessionId: session.sessionId,
    };
  }
}

export const analyticsManager = new AnalyticsManager();
