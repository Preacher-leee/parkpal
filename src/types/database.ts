
import { Database } from '@/integrations/supabase/types';

// Re-export the Database type
export type { Database } from '@/integrations/supabase/types';

// Type for parking_locations table rows
export type ParkingLocationType = Database['public']['Tables']['parking_locations']['Row'];

// Type for inserting a new parking location
export type InsertParkingLocationType = Database['public']['Tables']['parking_locations']['Insert'];

// Type for updating a parking location
export type UpdateParkingLocationType = Database['public']['Tables']['parking_locations']['Update'];

// Type for parking_timers table rows
export type ParkingTimerType = Database['public']['Tables']['parking_timers']['Row'];

// Type for inserting a new parking timer
export type InsertParkingTimerType = Database['public']['Tables']['parking_timers']['Insert'];

// Type for updating a parking timer
export type UpdateParkingTimerType = Database['public']['Tables']['parking_timers']['Update'];
