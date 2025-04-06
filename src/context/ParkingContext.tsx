
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParkingLocation, TimerInfo } from '../types';
import { mockParkingHistory } from '../lib/mockData';
import { toast } from '@/components/ui/sonner';

interface ParkingContextType {
  currentLocation: { latitude: number; longitude: number } | null;
  parkingHistory: ParkingLocation[];
  currentParking: ParkingLocation | null;
  parkingTimer: TimerInfo | null;
  saveParking: (parking: Omit<ParkingLocation, 'id' | 'timestamp'>) => void;
  clearCurrentParking: () => void;
  startParkingTimer: (duration: number) => void;
  stopParkingTimer: () => void;
  searchHistory: (query: string) => ParkingLocation[];
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [parkingHistory, setParkingHistory] = useState<ParkingLocation[]>(mockParkingHistory);
  const [currentParking, setCurrentParking] = useState<ParkingLocation | null>(null);
  const [parkingTimer, setParkingTimer] = useState<TimerInfo | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          // Set default location (New York City)
          setCurrentLocation({
            latitude: 40.7128,
            longitude: -74.0060,
          });
        }
      );
    }

    // Load parking data from localStorage
    const savedParking = localStorage.getItem('currentParking');
    if (savedParking) {
      setCurrentParking(JSON.parse(savedParking));
    }

    const savedTimer = localStorage.getItem('parkingTimer');
    if (savedTimer) {
      const timer = JSON.parse(savedTimer);
      setParkingTimer(timer);
      
      if (timer.isActive) {
        startTimerInternal(timer);
      }
    }

    return () => {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  // Save parking location
  const saveParking = (parking: Omit<ParkingLocation, 'id' | 'timestamp'>) => {
    const newParking: ParkingLocation = {
      ...parking,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setCurrentParking(newParking);
    setParkingHistory((prev) => [newParking, ...prev]);
    
    // Save to localStorage
    localStorage.setItem('currentParking', JSON.stringify(newParking));
    
    toast('Parking location saved!');
  };

  // Clear current parking
  const clearCurrentParking = () => {
    setCurrentParking(null);
    localStorage.removeItem('currentParking');
  };

  // Start parking timer
  const startParkingTimer = (duration: number) => {
    if (!currentParking) return;

    const timer: TimerInfo = {
      parkingId: currentParking.id,
      startTime: Date.now(),
      duration: duration,
      isActive: true,
    };

    setParkingTimer(timer);
    localStorage.setItem('parkingTimer', JSON.stringify(timer));
    
    startTimerInternal(timer);
    
    toast('Parking timer started!');
  };

  const startTimerInternal = (timer: TimerInfo) => {
    // Check if there's already an interval running
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }

    // Start a new interval
    const interval = window.setInterval(() => {
      const now = Date.now();
      const elapsedMinutes = (now - timer.startTime) / (1000 * 60);
      
      if (elapsedMinutes >= timer.duration) {
        // Timer completed
        stopParkingTimer();
        toast('Parking time expired!');
      }
    }, 10000); // Check every 10 seconds
    
    setTimerInterval(interval);
  };

  // Stop parking timer
  const stopParkingTimer = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    if (parkingTimer) {
      const updatedTimer = { ...parkingTimer, isActive: false };
      setParkingTimer(updatedTimer);
      localStorage.setItem('parkingTimer', JSON.stringify(updatedTimer));
    }
  };

  // Search parking history
  const searchHistory = (query: string): ParkingLocation[] => {
    if (!query.trim()) return parkingHistory;
    
    const lowerQuery = query.toLowerCase();
    
    return parkingHistory.filter(
      (parking) =>
        parking.address?.toLowerCase().includes(lowerQuery) ||
        parking.notes?.toLowerCase().includes(lowerQuery)
    );
  };

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
