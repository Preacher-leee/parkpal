
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useParkingContext } from '@/context/ParkingContext';
import { pulse } from 'lucide-react';

// This is a temporary token for development - in production, use environment variables
// You should replace this with your own Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1haS10ZXN0IiwiYSI6ImNsdXh2cHcxYzAwaTYyaXFnaTJuOTltcmEifQ.LNhF8GzcP1SP54u33_tJ_g';

interface MapComponentProps {
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const currentMarker = useRef<mapboxgl.Marker | null>(null);
  const parkingMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  const { currentLocation, currentParking, parkingTimer } = useParkingContext();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: currentLocation 
        ? [currentLocation.longitude, currentLocation.latitude]
        : [-74.006, 40.7128], // Default to NYC
      zoom: 14,
      pitch: 25
    });

    newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    // Add loading indicator
    newMap.on('load', () => {
      setMapLoaded(true);
    });

    map.current = newMap;

    return () => {
      newMap.remove();
    };
  }, []);

  // Update current location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !currentLocation) return;
    
    // Create current location element
    const el = document.createElement('div');
    el.className = 'current-location-marker';
    el.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white animate-pulse flex items-center justify-center shadow-lg">
        <div class="w-3 h-3 bg-white rounded-full"></div>
      </div>
    `;

    // Add or update current location marker
    if (currentMarker.current) {
      currentMarker.current.setLngLat([currentLocation.longitude, currentLocation.latitude]);
    } else {
      currentMarker.current = new mapboxgl.Marker(el)
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .addTo(map.current);
    }

    // Center map on current location
    map.current.flyTo({
      center: [currentLocation.longitude, currentLocation.latitude],
      essential: true,
      duration: 1000
    });
    
  }, [currentLocation, mapLoaded]);

  // Update parking location marker
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove previous parking marker if exists
    if (parkingMarker.current) {
      parkingMarker.current.remove();
      parkingMarker.current = null;
    }

    // Add new parking marker if parking location exists
    if (currentParking) {
      // Create element for the parking marker
      const el = document.createElement('div');
      el.className = 'parking-marker';
      
      let markerClass = "w-8 h-8 bg-green-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg";
      
      // If there's an active timer, adjust color based on status
      if (parkingTimer && parkingTimer.isActive) {
        const now = Date.now();
        const elapsedMinutes = (now - parkingTimer.startTime) / (1000 * 60);
        const remainingTime = parkingTimer.duration - elapsedMinutes;
        
        // Warning color when less than 15 minutes remaining
        if (remainingTime < 15 && remainingTime > 0) {
          markerClass = "w-8 h-8 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-pulse";
        } 
        // Expired color
        else if (remainingTime <= 0) {
          markerClass = "w-8 h-8 bg-red-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-pulse";
        }
      }
      
      el.innerHTML = `
        <div class="${markerClass}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2V5H3v12h2"></path>
            <path d="M14 17H10"></path>
            <circle cx="7" cy="15" r="2"></circle>
            <circle cx="17" cy="15" r="2"></circle>
          </svg>
        </div>
      `;

      // Add the marker to the map
      parkingMarker.current = new mapboxgl.Marker(el)
        .setLngLat([currentParking.coordinates.longitude, currentParking.coordinates.latitude])
        .addTo(map.current);

      // Fly to a view that shows both markers if current location exists
      if (currentLocation) {
        const bounds = new mapboxgl.LngLatBounds()
          .extend([currentLocation.longitude, currentLocation.latitude])
          .extend([currentParking.coordinates.longitude, currentParking.coordinates.latitude]);

        map.current.fitBounds(bounds, {
          padding: 100,
          maxZoom: 16,
          duration: 1500
        });
      }
    }
  }, [currentParking, parkingTimer, mapLoaded]);

  return (
    <div className={`relative rounded-lg overflow-hidden ${className || 'h-64'}`}>
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-t-parkpal-primary border-r-transparent border-b-parkpal-primary border-l-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
