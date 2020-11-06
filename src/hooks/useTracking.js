import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../firebase';

export const useTracking = () => {
  let location = useLocation();

  useEffect(() => {
    const page_path = location.pathname;
    analytics.logEvent('page_view', { page_path });
  }, [location]);
};
