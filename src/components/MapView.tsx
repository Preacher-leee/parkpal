
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, MapPin, Timer, Wallet } from 'lucide-react';
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
      <MapComponent className="h-[calc(100vh-16rem)] mb-4 shadow-md" />
      
      {/* Floating action buttons */}
      <div className="fixed bottom-24 right-4 z-10 flex flex-col gap-3">
        {!currentParking ? (
          <Button 
            className="rounded-full h-16 w-16 parkpal-shadow bg-parkpal-primary text-white transform transition-all duration-300 hover:scale-105 relative overflow-hidden group"
            onClick={handleParkHere}
          >
            <span className="absolute inset-0 bg-white/20 rounded-full animate-pulse group-hover:bg-white/30"></span>
            <Car size={24} />
            <span className="absolute -bottom-10 left-0 w-full text-xs font-medium transition-transform duration-300 transform group-hover:translate-y-[-2.5rem]">
              I Parked
            </span>
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
      
      {/* Location info in minimal format */}
      {currentParking && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md mb-4 border-l-4 border-parkpal-primary">
          <div className="text-center">
            <p className="text-lg font-medium">Parked Car Location</p>
            {currentParking.address && (
              <p className="text-sm mt-1">{currentParking.address}</p>
            )}
            {currentParking.notes && (
              <p className="text-xs italic mt-1">"{currentParking.notes}"</p>
            )}
          </div>
        </div>
      )}
      
      {/* Offline mode indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs flex items-center shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span>Online</span>
        </div>
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
