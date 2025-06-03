// Google Analytics event tracking utilities

type EventCategory = 'Button' | 'Link' | 'Navigation' | 'Form' | 'Other';
type EventAction = 'Click' | 'Submit' | 'View' | 'Download' | 'Other';

export interface EventParams {
  category: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (params: EventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', params.action, {
      event_category: params.category,
      event_label: params.label,
      value: params.value,
      non_interaction: params.nonInteraction,
    });
  }
};

/**
 * Track a button click event
 */
export const trackButtonClick = (buttonName: string, additionalParams?: Partial<EventParams>) => {
  trackEvent({
    category: 'Button',
    action: 'Click',
    label: buttonName,
    ...additionalParams,
  });
};

/**
 * Track a link click event
 */
export const trackLinkClick = (linkName: string, linkUrl: string, additionalParams?: Partial<EventParams>) => {
  trackEvent({
    category: 'Link',
    action: 'Click',
    label: `${linkName} - ${linkUrl}`,
    ...additionalParams,
  });
};

/**
 * Track a navigation event
 */
export const trackNavigation = (pageName: string, additionalParams?: Partial<EventParams>) => {
  trackEvent({
    category: 'Navigation',
    action: 'View',
    label: pageName,
    ...additionalParams,
  });
}; 