
import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Car } from 'lucide-react';
import { useParkingContext } from '@/context/ParkingContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// The Google Maps API key should be restricted in production
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const RealMapView: React.FC = () => {
  const { currentLocation, currentParking } = useParkingContext();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<'current' | 'parking' | null>(null);
  const [mapApiKey, setMapApiKey] = useState<string>(GOOGLE_MAPS_API_KEY);
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: mapApiKey
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Center the map on the relevant location
  useEffect(() => {
    if (map) {
      if (currentParking) {
        map.panTo({
          lat: currentParking.coordinates.latitude,
          lng: currentParking.coordinates.longitude
        });
        map.setZoom(18);
      } else if (currentLocation) {
        map.panTo({
          lat: currentLocation.latitude,
          lng: currentLocation.longitude
        });
        map.setZoom(16);
      }
    }
  }, [map, currentLocation, currentParking]);

  // Optional API key input for development
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapApiKey(e.target.value);
  };

  if (loadError) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading Google Maps</p>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Google Maps API key"
              className="p-2 border rounded w-full"
              value={mapApiKey}
              onChange={handleApiKeyChange}
            />
          </div>
          <Button onClick={() => window.location.reload()}>
            Reload Map
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          currentParking 
            ? { lat: currentParking.coordinates.latitude, lng: currentParking.coordinates.longitude }
            : currentLocation 
              ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
              : { lat: 40.7128, lng: -74.0060 } // Default: New York City
        }
        zoom={18}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
          gestureHandling: 'greedy'
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {currentLocation && !currentParking && (
          <Marker
            position={{
              lat: currentLocation.latitude,
              lng: currentLocation.longitude
            }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(40, 40)
            }}
            onClick={() => setSelectedMarker('current')}
          />
        )}

        {currentParking && (
          <Marker
            position={{
              lat: currentParking.coordinates.latitude,
              lng: currentParking.coordinates.longitude
            }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(50, 50)
            }}
            animation={google.maps.Animation.DROP}
            onClick={() => setSelectedMarker('parking')}
          />
        )}

        {selectedMarker === 'current' && currentLocation && (
          <InfoWindow
            position={{
              lat: currentLocation.latitude,
              lng: currentLocation.longitude
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <p className="font-medium">Your current location</p>
            </div>
          </InfoWindow>
        )}

        {selectedMarker === 'parking' && currentParking && (
          <InfoWindow
            position={{
              lat: currentParking.coordinates.latitude,
              lng: currentParking.coordinates.longitude
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2">
                <Car size={16} className="text-parkpal-primary" />
                <p className="font-medium">Your parked vehicle</p>
              </div>
              {currentParking.address && (
                <p className="text-sm">{currentParking.address}</p>
              )}
              {currentParking.notes && (
                <p className="text-xs italic mt-1">{currentParking.notes}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map key input overlay for development */}
      {mapApiKey === 'YOUR_API_KEY_HERE' && (
        <div className="absolute bottom-2 left-2 right-2 bg-white/90 p-3 rounded-md shadow-md z-10">
          <p className="text-xs text-amber-600 mb-2">
            Enter a valid Google Maps API key:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Your Google Maps API key"
              className="p-2 border text-sm rounded flex-1"
              value={mapApiKey}
              onChange={handleApiKeyChange}
            />
            <Button size="sm" onClick={() => window.location.reload()}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealMapView;
