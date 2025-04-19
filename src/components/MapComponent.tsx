import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useParkingContext } from '@/context/ParkingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AMAZON_MAP_NAME = 'ParkPal'; // Replace with your actual Amazon Location Service map name
const AMAZON_MAP_REGION = 'us-east-2';
const AMAZON_API_KEY = 'v1.public.eyJqdGkiOiI4YWJkYTQ1Ny00Y2NhLTRmNTUtYmUzZi05MGFkMGE0MDBkYTcifaJUOB8uYmyUi-78KAJ5sPLRmLtAVsANQvKHPo-keQBus4lt6DQyOF0bzP3N89S9CVDUXnIUHd6Z_Ucl2fYT7q1ZuthiK0xUvriOdHav2abNxelb178qiOBUl8VfAbkqebAUUA4icF3BEEdQyHIxiDMLmHDNfbvWY6UckYfaIcOmkjpJ4L8aGCFD3HOOXm9-y-74ofR8H5ETRxukWypYR-IWFcV6Am71ASXbqvUrS4-uVnV_NPUcs0QpXHg4B_lVTVuSoS_c48ZqGedneKI2jIlfXNCXhqL3sOS_xzTSFkTjQWJhbrpSo4GwN45RZbmoRt1trS_khZ-yTG1CZQVlvy4.NjAyMWJkZWUtMGMyOS00NmRkLThjZTMtODEyOTkzZTUyMTBi';

interface MapComponentProps {
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const currentMarker = useRef<maplibregl.Marker | null>(null);
  const parkingMarker = useRef<maplibregl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { currentLocation, currentParking, parkingTimer } = useParkingContext();

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geo.${AMAZON_MAP_REGION}.amazonaws.com/maps/v0/maps/${AMAZON_MAP_NAME}/style-descriptor?key=${AMAZON_API_KEY}`,
      center: currentLocation
        ? [currentLocation.longitude, currentLocation.latitude]
        : [-74.006, 40.7128], // Default NYC
      zoom: 14,
      pitch: 25
    });

    mapInstance.addControl(new maplibregl.NavigationControl(), 'bottom-right');

    mapInstance.on('load', () => {
      setMapLoaded(true);
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded || !currentLocation) return;

    const el = document.createElement('div');
    el.className = 'current-location-marker';
    el.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white animate-pulse flex items-center justify-center shadow-lg">
        <div class="w-3 h-3 bg-white rounded-full"></div>
      </div>
    `;

    if (currentMarker.current) {
      currentMarker.current.setLngLat([currentLocation.longitude, currentLocation.latitude]);
    } else {
      currentMarker.current = new maplibregl.Marker(el)
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .addTo(map.current);
    }

    map.current.flyTo({
      center: [currentLocation.longitude, currentLocation.latitude],
      essential: true,
      duration: 1000
    });
  }, [currentLocation, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (parkingMarker.current) {
      parkingMarker.current.remove();
      parkingMarker.current = null;
    }

    if (currentParking) {
      const el = document.createElement('div');
      el.className = 'parking-marker';

      let markerClass = "w-8 h-8 bg-green-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg";

      if (parkingTimer && parkingTimer.isActive) {
        const now = Date.now();
        const elapsedMinutes = (now - parkingTimer.startTime) / (1000 * 60);
        const remainingTime = parkingTimer.duration - elapsedMinutes;

        if (remainingTime < 15 && remainingTime > 0) {
          markerClass = "w-8 h-8 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-pulse";
        } else if (remainingTime <= 0) {
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

      parkingMarker.current = new maplibregl.Marker(el)
        .setLngLat([currentParking.coordinates.longitude, currentParking.coordinates.latitude])
        .addTo(map.current);

      if (currentLocation) {
        const bounds = new maplibregl.LngLatBounds()
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
