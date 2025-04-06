
import React, { createContext, useContext } from 'react';
import { ParkingContextType } from './types';
import { useAuth } from '@/context/AuthContext';
import { useGeolocation } from './useGeolocation';
import { useParkingData } from './useParkingData';
import { useParkingActions } from './useParkingActions';

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get authentication state
  const { session } = useAuth();
  const userId = session?.user?.id;
  
  // Get current location using geolocation hook
  const currentLocation = useGeolocation();
  
  // Get parking data from custom hook
  const {
    parkingHistory,
    setParkingHistory,
    currentParking,
    setCurrentParking,
    parkingTimer,
    setParkingTimer,
    searchHistory
  } = useParkingData(userId);
  
  // Get parking actions from custom hook
  const {
    saveParking,
    clearCurrentParking,
    startParkingTimer,
    stopParkingTimer
  } = useParkingActions({
    userId,
    currentParking,
    setCurrentParking,
    setParkingHistory,
    parkingTimer,
    setParkingTimer
  });

  return (
    <ParkingContext.Provider
      value={{
        currentLocation,
        parkingHistory,
        currentParking,
        parkingTimer,
        saveParking,
        clearCurrentParking,
        startParkingTimer,
        stopParkingTimer,
        searchHistory,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
};
