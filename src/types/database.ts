
export interface ParkingLocationType {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  address: string | null;
  notes: string | null;
  duration: number | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParkingTimerType {
  id: string;
  parking_id: string;
  user_id: string;
  start_time: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}
