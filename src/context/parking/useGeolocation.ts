
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useGeolocation = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const getCurrentPosition = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            toast('Unable to get your current location. Please check permissions.');
          }
        );
      } else {
        toast('Geolocation is not supported by your browser.');
      }
    };

    getCurrentPosition();
    // Update position every 30 seconds
    const intervalId = setInterval(getCurrentPosition, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return currentLocation;
};
