
import { ParkingLocation, TimerInfo } from '@/types';

export interface ParkingContextType {
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
