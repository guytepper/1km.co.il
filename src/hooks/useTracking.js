import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../firebase';

/**
 * Tracks page views through firebase analytics.
 */

export const useTracking = () => {
  let location = useLocation();

  useEffect(() => {
    const page_path = location.pathname;
    analytics.logEvent('page_view', { page_path });
  }, [location]);
};
