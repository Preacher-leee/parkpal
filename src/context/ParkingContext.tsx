
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParkingLocation, TimerInfo } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ParkingLocationType, ParkingTimerType } from '@/types/database';
import { Database } from '@/integrations/supabase/types';

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
  // Get authentication state
  const { session } = useAuth();
  const userId = session?.user?.id;
  
  // State
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [parkingHistory, setParkingHistory] = useState<ParkingLocation[]>([]);
  const [currentParking, setCurrentParking] = useState<ParkingLocation | null>(null);
  const [parkingTimer, setParkingTimer] = useState<TimerInfo | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Fetch current location
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

  // Fetch parking data from Supabase when userId changes
  useEffect(() => {
    const fetchParkingData = async () => {
      if (!userId) return;
      
      try {
        // Fetch current parking location
        const { data: currentParkingData, error: currentError } = await supabase
          .from('parking_locations')
          .select('*')
          .eq('user_id', userId)
          .eq('is_current', true)
          .maybeSingle();
          
        if (currentError) throw currentError;
        
        if (currentParkingData) {
          // Convert from database format to app format
          setCurrentParking({
            id: currentParkingData.id,
            coordinates: {
              latitude: Number(currentParkingData.latitude),
              longitude: Number(currentParkingData.longitude)
            },
            timestamp: new Date(currentParkingData.created_at || '').getTime(),
            notes: currentParkingData.notes || undefined,
            address: currentParkingData.address || undefined,
            duration: currentParkingData.duration || undefined
          });
          
          // Check for active timer
          const { data: timerData, error: timerError } = await supabase
            .from('parking_timers')
            .select('*')
            .eq('parking_id', currentParkingData.id)
            .eq('is_active', true)
            .maybeSingle();
            
          if (timerError) throw timerError;
          
          if (timerData) {
            setParkingTimer({
              parkingId: timerData.parking_id,
              startTime: new Date(timerData.start_time).getTime(),
              duration: timerData.duration_minutes,
              isActive: timerData.is_active
            });
          }
        }
        
        // Fetch parking history
        const { data: historyData, error: historyError } = await supabase
          .from('parking_locations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (historyError) throw historyError;
        
        if (historyData) {
          // Convert from database format to app format
          const formattedHistory = historyData.map(item => ({
            id: item.id,
            coordinates: {
              latitude: Number(item.latitude),
              longitude: Number(item.longitude)
            },
            timestamp: new Date(item.created_at || '').getTime(),
            notes: item.notes || undefined,
            address: item.address || undefined,
            duration: item.duration || undefined
          }));
          
          setParkingHistory(formattedHistory);
        }
      } catch (error) {
        console.error('Error fetching parking data:', error);
        toast('Failed to load your parking data.');
      }
    };
    
    fetchParkingData();
  }, [userId]);

  // Handle timer expiry notification
  useEffect(() => {
    if (!parkingTimer || !parkingTimer.isActive) {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      return;
    }

    const checkTimer = () => {
      if (!parkingTimer) return;
      
      const now = Date.now();
      const endTime = parkingTimer.startTime + (parkingTimer.duration * 60 * 1000);
      
      if (now >= endTime && parkingTimer.isActive) {
        // Timer expired
        toast('Your parking time has ended!');
        // Update timer state and database
        stopParkingTimer();
      }
    };

    // Check immediately and then every minute
    checkTimer();
    const interval = window.setInterval(checkTimer, 60000);
    setTimerInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [parkingTimer]);

  const saveParking = async (data: Omit<ParkingLocation, 'id' | 'timestamp'>) => {
    if (!userId) {
      toast('Please log in to save your parking location.');
      return;
    }
    
    if (!data.coordinates) {
      toast('No location coordinates provided.');
      return;
    }
    
    try {
      const parkingId = uuidv4();
      
      // If there's an existing current parking, update it to not be current
      if (currentParking) {
        await supabase
          .from('parking_locations')
          .update({ is_current: false })
          .eq('id', currentParking.id);
      }
      
      // Insert new parking location
      const newParkingLocation = {
        id: parkingId,
        user_id: userId,
        latitude: data.coordinates.latitude,
        longitude: data.coordinates.longitude,
        address: data.address || null,
        notes: data.notes || null,
        duration: data.duration || null,
        is_current: true
      };
      
      const { error } = await supabase
        .from('parking_locations')
        .insert(newParkingLocation);
        
      if (error) throw error;
      
      // Update local state
      const newParking = {
        id: parkingId,
        coordinates: data.coordinates,
        timestamp: Date.now(),
        notes: data.notes,
        address: data.address,
        duration: data.duration
      };
      
      setCurrentParking(newParking);
      setParkingHistory((prev) => [newParking, ...prev]);
      
      toast('Your parking location has been saved.');
    } catch (error) {
      console.error('Error saving parking:', error);
      toast('Failed to save parking location.');
    }
  };

  const clearCurrentParking = async () => {
    if (!currentParking || !userId) return;
    
    try {
      // Update the database
      const { error } = await supabase
        .from('parking_locations')
        .update({ is_current: false })
        .eq('id', currentParking.id);
        
      if (error) throw error;
      
      // Also clear any active timers
      if (parkingTimer && parkingTimer.isActive) {
        await stopParkingTimer();
      }
      
      // Update local state
      setCurrentParking(null);
      
      toast('Your current parking has been cleared.');
    } catch (error) {
      console.error('Error clearing parking:', error);
      toast('Failed to clear parking location.');
    }
  };

  // Search parking history
  const searchHistory = (query: string): ParkingLocation[] => {
    if (!query.trim()) return parkingHistory;
    
    const lowerQuery = query.toLowerCase();
    
    return parkingHistory.filter(
      (parking) =>
        (parking.address && parking.address.toLowerCase().includes(lowerQuery)) ||
        (parking.notes && parking.notes.toLowerCase().includes(lowerQuery))
    );
  };

  // Start parking timer
  const startParkingTimer = async (duration: number) => {
    if (!currentParking || !userId) return;
    
    try {
      const timerId = uuidv4();
      const now = new Date();
      
      // Insert into database
      const newTimer = {
        id: timerId,
        parking_id: currentParking.id,
        user_id: userId,
        start_time: now.toISOString(),
        duration_minutes: duration,
        is_active: true
      };
      
      const { error } = await supabase
        .from('parking_timers')
        .insert(newTimer);
        
      if (error) throw error;
      
      // Update local state
      setParkingTimer({
        parkingId: currentParking.id,
        startTime: now.getTime(),
        duration: duration,
        isActive: true
      });
      
      toast(`Parking timer set for ${duration} minutes.`);
    } catch (error) {
      console.error('Error starting timer:', error);
      toast('Failed to start parking timer.');
    }
  };

  // Stop parking timer
  const stopParkingTimer = async () => {
    if (!parkingTimer || !userId) return;
    
    try {
      // Update database
      const { error } = await supabase
        .from('parking_timers')
        .update({ is_active: false })
        .eq('parking_id', parkingTimer.parkingId)
        .eq('is_active', true);
        
      if (error) throw error;
      
      // Update local state
      setParkingTimer((prev) => prev ? { ...prev, isActive: false } : null);
      
      toast('Your parking timer has been stopped.');
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast('Failed to stop parking timer.');
    }
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
