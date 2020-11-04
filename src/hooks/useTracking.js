import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const useTracking = (trackingId = process.env.GA_MEASUREMENT_ID) => {
  const { listen } = useHistory();

  useEffect(() => {
    const unlisten = listen((location) => {
      if (!window.gtag) return;
      if (!trackingId) {
        console.log('Tracking not enabled, as `trackingId` was not given and there is no `GA_MEASUREMENT_ID`.');
        return;
      }

      window.gtag('config', trackingId, { page_path: location.pathname });
    });

    return unlisten;
  }, [trackingId, listen]);
};
