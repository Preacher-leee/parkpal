
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, MapPin, Timer } from 'lucide-react';
import { useParkingContext } from '@/context/ParkingContext';
import ParkingForm from './ParkingForm';
import ParkingTimer from './ParkingTimer';
import RealMapView from './RealMapView';

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
      {/* Real Map View */}
      <div className="bg-gray-100 h-full rounded-lg overflow-hidden shadow-md">
        <RealMapView />
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
