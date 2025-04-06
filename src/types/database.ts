
// This file manually defines the types for our Supabase tables
// without modifying the read-only src/integrations/supabase/types.ts file

// Define the structure for parking_locations table
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

// Type for inserting a new parking location
export interface InsertParkingLocationType {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  address: string | null;
  notes: string | null;
  duration: number | null;
  is_current: boolean;
}

// Type for updating a parking location
export interface UpdateParkingLocationType {
  id?: string;
  user_id?: string;
  latitude?: number;
  longitude?: number;
  address?: string | null;
  notes?: string | null;
  duration?: number | null;
  is_current?: boolean;
  updated_at?: string;
}

// Type for parking_timers table rows
export interface ParkingTimerType {
  id: string;
  parking_id: string;
  user_id: string;
  start_time: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

// Type for inserting a new parking timer
export interface InsertParkingTimerType {
  id: string;
  parking_id: string;
  user_id: string;
  start_time: string;
  duration_minutes: number;
  is_active: boolean;
}

// Type for updating a parking timer
export interface UpdateParkingTimerType {
  id?: string;
  parking_id?: string;
  user_id?: string;
  start_time?: string;
  duration_minutes?: number;
  is_active?: boolean;
}
