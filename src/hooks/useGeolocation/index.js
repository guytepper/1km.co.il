import { useState, useEffect } from 'react';

const useGeolocation = ([latitude, longitude]) => {
  const [state, setState] = useState({
    latitude,
    longitude,
    accuracy: null,
    timestamp: Date.now(),
  });

  const onEvent = (event) => {
    setState({
      accuracy: event.coords.accuracy,
      latitude: event.coords.latitude,
      longitude: event.coords.longitude,
      timestamp: event.timestamp,
    });
  };

  const onError = (error) => {
    // TODO: Handle rejections / errors.
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onEvent, onError);
    const watchId = navigator.geolocation.watchPosition(onEvent, onError);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
};

export default useGeolocation;
