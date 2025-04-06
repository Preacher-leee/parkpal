
-- Create the parking_locations table
CREATE TABLE IF NOT EXISTS public.parking_locations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  notes TEXT,
  duration INTEGER, -- In minutes
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create the parking_timers table
CREATE TABLE IF NOT EXISTS public.parking_timers (
  id UUID PRIMARY KEY,
  parking_id UUID NOT NULL REFERENCES public.parking_locations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security on both tables
ALTER TABLE public.parking_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_timers ENABLE ROW LEVEL SECURITY;

-- Create policies for parking_locations
CREATE POLICY "Users can view their own parking locations" 
  ON public.parking_locations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own parking locations" 
  ON public.parking_locations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parking locations" 
  ON public.parking_locations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own parking locations" 
  ON public.parking_locations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for parking_timers
CREATE POLICY "Users can view their own parking timers" 
  ON public.parking_timers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own parking timers" 
  ON public.parking_timers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parking timers" 
  ON public.parking_timers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own parking timers" 
  ON public.parking_timers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add indices for better performance
CREATE INDEX IF NOT EXISTS parking_locations_user_id_idx ON public.parking_locations(user_id);
CREATE INDEX IF NOT EXISTS parking_locations_is_current_idx ON public.parking_locations(is_current);
CREATE INDEX IF NOT EXISTS parking_timers_parking_id_idx ON public.parking_timers(parking_id);
CREATE INDEX IF NOT EXISTS parking_timers_user_id_idx ON public.parking_timers(user_id);
CREATE INDEX IF NOT EXISTS parking_timers_is_active_idx ON public.parking_timers(is_active);
