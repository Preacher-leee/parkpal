
export type View = 'map' | 'history' | 'settings';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ParkingLocation {
  id: string;
  coordinates: Coordinates;
  timestamp: number; // Unix timestamp
  notes?: string;
  address?: string;
  photo?: string;
  duration?: number; // In minutes, for parking timers
}

export interface TimerInfo {
  parkingId: string;
  startTime: number;
  duration: number; // In minutes
  isActive: boolean;
}
