import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../firebase';
import { useStore } from '../stores';

/**
 * Tracks page views through firebase analytics.
 */

export const useTracking = () => {
  const store = useStore();
  let location = useLocation();

  useEffect(() => {
    // Give the page title time to update after route change.
    setTimeout(() => {
      const page_path = location.pathname;
      const page_title = store.currentPageTitle;
      analytics.logEvent('page_view', { page_path, page_title });
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
};
