import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ParkingLocation, Coordinates, TimerInfo } from '@/types';
import { 
  ParkingLocationType, 
  InsertParkingLocationType, 
  ParkingTimerType, 
  InsertParkingTimerType 
} from '@/types/database';

interface ParkingContextType {
  currentLocation: Coordinates | null;
  currentParking: ParkingLocation | null;
  parkingHistory: ParkingLocation[];
  parkingTimer: TimerInfo | null;
  saveParking: (data: Partial<ParkingLocation>) => void;
  clearCurrentParking: () => void;
  searchHistory: (query: string) => ParkingLocation[];
  startParkingTimer: (duration: number) => void;
  stopParkingTimer: () => void;
}

const ParkingContext = createContext<ParkingContextType | null>(null);

export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
};

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [currentParking, setCurrentParking] = useState<ParkingLocation | null>(null);
  const [parkingHistory, setParkingHistory] = useState<ParkingLocation[]>([]);
  const [parkingTimer, setParkingTimer] = useState<TimerInfo | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

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
            toast({
              title: 'Location Error',
              description: 'Unable to get your current location. Please check permissions.',
              variant: 'destructive',
            });
          }
        );
      } else {
        toast({
          title: 'Location Not Supported',
          description: 'Geolocation is not supported by your browser.',
          variant: 'destructive',
        });
      }
    };

    getCurrentPosition();
    
    const intervalId = setInterval(getCurrentPosition, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchParkingData = async () => {
      if (!userId) return;

      try {
        const { data: currentParkingData, error: currentError } = await supabase
          .from('parking_locations')
          .select('*')
          .eq('user_id', userId)
          .eq('is_current', true)
          .maybeSingle();

        if (currentError) throw currentError;

        if (currentParkingData) {
          const parkingData = currentParkingData as ParkingLocationType;
          
          setCurrentParking({
            id: parkingData.id,
            coordinates: {
              latitude: parkingData.latitude,
              longitude: parkingData.longitude
            },
            timestamp: new Date(parkingData.created_at).getTime(),
            notes: parkingData.notes || undefined,
            address: parkingData.address || undefined,
            duration: parkingData.duration || undefined,
          });

          const { data: timerData, error: timerError } = await supabase
            .from('parking_timers')
            .select('*')
            .eq('parking_id', parkingData.id)
            .eq('is_active', true)
            .maybeSingle();

          if (timerError) throw timerError;

          if (timerData) {
            const timer = timerData as ParkingTimerType;
            
            setParkingTimer({
              parkingId: timer.parking_id,
              startTime: new Date(timer.start_time).getTime(),
              duration: timer.duration_minutes,
              isActive: timer.is_active,
            });
          }
        }

        const { data: historyData, error: historyError } = await supabase
          .from('parking_locations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (historyError) throw historyError;

        if (historyData) {
          const formattedHistory = (historyData as ParkingLocationType[]).map(item => ({
            id: item.id,
            coordinates: {
              latitude: item.latitude,
              longitude: item.longitude
            },
            timestamp: new Date(item.created_at).getTime(),
            notes: item.notes || undefined,
            address: item.address || undefined,
            duration: item.duration || undefined,
          }));
          
          setParkingHistory(formattedHistory);
        }
      } catch (error) {
        console.error('Error fetching parking data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your parking data.',
          variant: 'destructive',
        });
      }
    };

    fetchParkingData();
  }, [userId]);

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
        toast({
          title: 'Parking Time Expired',
          description: 'Your parking time has ended!',
          variant: 'destructive',
        });
        
        stopParkingTimer();
      }
    };

    checkTimer();
    const interval = window.setInterval(checkTimer, 60000);
    setTimerInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [parkingTimer]);

  const saveParking = async (data: Partial<ParkingLocation>) => {
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save your parking location.',
        variant: 'destructive',
      });
      return;
    }

    if (!data.coordinates) {
      toast({
        title: 'Error',
        description: 'No location coordinates provided.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const parkingId = data.id || uuidv4();
      
      if (currentParking) {
        await supabase
          .from('parking_locations')
          .update({ is_current: false })
          .eq('id', currentParking.id);
      }

      const newParkingLocation: InsertParkingLocationType = {
        id: parkingId,
        user_id: userId,
        latitude: data.coordinates.latitude,
        longitude: data.coordinates.longitude,
        address: data.address || null,
        notes: data.notes || null,
        duration: data.duration || null,
        is_current: true,
      };

      const { error } = await supabase
        .from('parking_locations')
        .insert(newParkingLocation);

      if (error) throw error;

      const newParking: ParkingLocation = {
        id: parkingId,
        coordinates: data.coordinates,
        timestamp: Date.now(),
        notes: data.notes,
        address: data.address,
        duration: data.duration,
      };

      setCurrentParking(newParking);
      setParkingHistory(prev => [newParking, ...prev]);

      toast({
        title: 'Parking Saved',
        description: 'Your parking location has been saved.',
      });

    } catch (error) {
      console.error('Error saving parking:', error);
      toast({
        title: 'Error',
        description: 'Failed to save parking location.',
        variant: 'destructive',
      });
    }
  };

  const clearCurrentParking = async () => {
    if (!currentParking || !userId) return;

    try {
      const { error } = await supabase
        .from('parking_locations')
        .update({ is_current: false })
        .eq('id', currentParking.id);

      if (error) throw error;

      if (parkingTimer && parkingTimer.isActive) {
        await stopParkingTimer();
      }

      setCurrentParking(null);
      
      toast({
        title: 'Parking Cleared',
        description: 'Your current parking has been cleared.',
      });
    } catch (error) {
      console.error('Error clearing parking:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear parking location.',
        variant: 'destructive',
      });
    }
  };

  const searchHistory = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return parkingHistory.filter(
      parking => 
        (parking.address && parking.address.toLowerCase().includes(lowerQuery)) ||
        (parking.notes && parking.notes.toLowerCase().includes(lowerQuery))
    );
  };

  const startParkingTimer = async (duration: number) => {
    if (!currentParking || !userId) return;

    try {
      const timerId = uuidv4();
      const now = new Date();
      
      const newTimer: InsertParkingTimerType = {
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

      setParkingTimer({
        parkingId: currentParking.id,
        startTime: now.getTime(),
        duration: duration,
        isActive: true
      });

      toast({
        title: 'Timer Started',
        description: `Parking timer set for ${duration} minutes.`,
      });
    } catch (error) {
      console.error('Error starting timer:', error);
      toast({
        title: 'Error',
        description: 'Failed to start parking timer.',
        variant: 'destructive',
      });
    }
  };

  const stopParkingTimer = async () => {
    if (!parkingTimer || !userId) return;

    try {
      const { error } = await supabase
        .from('parking_timers')
        .update({ is_active: false })
        .eq('parking_id', parkingTimer.parkingId)
        .eq('is_active', true);

      if (error) throw error;

      setParkingTimer(prev => prev ? { ...prev, isActive: false } : null);

      toast({
        title: 'Timer Stopped',
        description: 'Your parking timer has been stopped.',
      });
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop parking timer.',
        variant: 'destructive',
      });
    }
  };

  return (
    <ParkingContext.Provider
      value={{
        currentLocation,
        currentParking,
        parkingHistory,
        parkingTimer,
        saveParking,
        clearCurrentParking,
        searchHistory,
        startParkingTimer,
        stopParkingTimer
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};
