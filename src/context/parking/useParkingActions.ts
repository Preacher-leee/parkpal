
import { useState } from 'react';
import { ParkingLocation, TimerInfo } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ParkingDataProps {
  userId: string | undefined;
  currentParking: ParkingLocation | null;
  setCurrentParking: (parking: ParkingLocation | null) => void;
  setParkingHistory: (setter: (prev: ParkingLocation[]) => ParkingLocation[]) => void;
  parkingTimer: TimerInfo | null;
  setParkingTimer: (timer: TimerInfo | null | ((prev: TimerInfo | null) => TimerInfo | null)) => void;
}

export const useParkingActions = ({
  userId,
  currentParking,
  setCurrentParking,
  setParkingHistory,
  parkingTimer,
  setParkingTimer
}: ParkingDataProps) => {
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

  return {
    saveParking,
    clearCurrentParking,
    startParkingTimer,
    stopParkingTimer
  };
};
