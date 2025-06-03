import { useCallback } from 'react';
import { trackButtonClick, trackLinkClick, trackNavigation, trackEvent, EventParams } from '@/lib/analytics';

export const useAnalytics = () => {
  const trackButton = useCallback((buttonName: string, additionalParams?: Partial<EventParams>) => {
    trackButtonClick(buttonName, additionalParams);
  }, []);

  const trackLink = useCallback((linkName: string, linkUrl: string, additionalParams?: Partial<EventParams>) => {
    trackLinkClick(linkName, linkUrl, additionalParams);
  }, []);

  const trackPage = useCallback((pageName: string, additionalParams?: Partial<EventParams>) => {
    trackNavigation(pageName, additionalParams);
  }, []);

  const trackCustomEvent = useCallback((params: EventParams) => {
    trackEvent(params);
  }, []);

  return {
    trackButton,
    trackLink,
    trackPage,
    trackCustomEvent,
  };
}; 