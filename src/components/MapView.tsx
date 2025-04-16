
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, MapPin, Timer } from 'lucide-react';
import { useParkingContext } from '@/context/ParkingContext';
import ParkingForm from './ParkingForm';
import ParkingTimer from './ParkingTimer';
import MapComponent from './MapComponent';

const MapView: React.FC = () => {
  const { currentLocation, currentParking, saveParking, clearCurrentParking } = useParkingContext();
  const [showParkingForm, setShowParkingForm] = useState(false);
  const [showTimerForm, setShowTimerForm] = useState(false);

  const handleParkHere = () => {
    if (!currentLocation) return;
    
    setShowParkingForm(true);
  };

  const handleGoToParking = () => {
    if (!currentParking) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${currentParking.coordinates.latitude},${currentParking.coordinates.longitude}&travelmode=walking`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative h-full w-full pb-20">
      {/* Real interactive map */}
      <MapComponent className="h-64 mb-4 shadow-md" />
      
      {/* Location info */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="text-center">
          {currentLocation ? (
            <div>
              <p className="text-lg font-medium">Current Location:</p>
              <p className="text-sm">Lat: {currentLocation.latitude.toFixed(6)}</p>
              <p className="text-sm">Lng: {currentLocation.longitude.toFixed(6)}</p>
              {currentParking && (
                <div className="mt-4">
                  <p className="text-lg font-medium">Parked Car Location:</p>
                  <p className="text-sm">Lat: {currentParking.coordinates.latitude.toFixed(6)}</p>
                  <p className="text-sm">Lng: {currentParking.coordinates.longitude.toFixed(6)}</p>
                  {currentParking.address && <p className="text-sm mt-1">{currentParking.address}</p>}
                  {currentParking.notes && <p className="text-xs italic mt-1">"{currentParking.notes}"</p>}
                </div>
              )}
            </div>
          ) : (
            <p>Loading current location...</p>
          )}
        </div>
      </div>
      
      {/* Floating action buttons */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2">
        {!currentParking ? (
          <Button 
            className="rounded-full h-14 w-14 parkpal-shadow"
            onClick={handleParkHere}
          >
            <Car size={20} />
          </Button>
        ) : (
          <>
            <Button 
              className="rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 parkpal-shadow"
              onClick={handleGoToParking}
            >
              <MapPin size={20} />
            </Button>
            <Button 
              className="rounded-full h-14 w-14 bg-amber-500 hover:bg-amber-600 parkpal-shadow"
              onClick={() => setShowTimerForm(true)}
            >
              <Timer size={20} />
            </Button>
            <Button 
              className="rounded-full h-14 w-14 bg-red-500 hover:bg-red-600 parkpal-shadow"
              onClick={clearCurrentParking}
              variant="destructive"
            >
              <Car size={20} className="rotate-180" />
            </Button>
          </>
        )}
      </div>
      
      {/* Parking Form Dialog */}
      {showParkingForm && (
        <ParkingForm 
          onClose={() => setShowParkingForm(false)}
          onSubmit={(data) => {
            if (currentLocation) {
              saveParking({
                coordinates: currentLocation,
                ...data
              });
              setShowParkingForm(false);
            }
          }}
        />
      )}
      
      {/* Timer Form Dialog */}
      {showTimerForm && currentParking && (
        <ParkingTimer
          parkingId={currentParking.id}
          onClose={() => setShowTimerForm(false)}
        />
      )}
    </div>
  );
};

export default MapView;
