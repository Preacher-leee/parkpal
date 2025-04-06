
import { useState, useEffect } from 'react';
import { ParkingLocation, TimerInfo } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const useParkingData = (userId: string | undefined) => {
  const [parkingHistory, setParkingHistory] = useState<ParkingLocation[]>([]);
  const [currentParking, setCurrentParking] = useState<ParkingLocation | null>(null);
  const [parkingTimer, setParkingTimer] = useState<TimerInfo | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

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
        // Update timer state
        setParkingTimer((prev) => prev ? { ...prev, isActive: false } : null);
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

  return {
    parkingHistory,
    setParkingHistory,
    currentParking,
    setCurrentParking,
    parkingTimer,
    setParkingTimer,
    searchHistory
  };
};
