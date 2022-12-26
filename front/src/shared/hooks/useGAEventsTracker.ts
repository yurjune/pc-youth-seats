import ReactGA from 'react-ga4';

export const useGAEventsTracker = (category = 'seat') => {
  const trackEvent = (action: string) => {
    ReactGA.event({ category, action });
  };
  return { trackEvent };
};
