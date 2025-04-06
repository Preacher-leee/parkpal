
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useParkingContext } from '@/context/ParkingContext';

interface ParkingTimerProps {
  parkingId: string;
  onClose: () => void;
}

const ParkingTimer: React.FC<ParkingTimerProps> = ({ parkingId, onClose }) => {
  const [duration, setDuration] = useState<number>(60); // Default 60 minutes
  const { startParkingTimer, parkingTimer, stopParkingTimer } = useParkingContext();

  const isTimerActive = parkingTimer?.isActive && parkingTimer?.parkingId === parkingId;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };
  
  const calculateTimeRemaining = (): string => {
    if (!parkingTimer || !parkingTimer.isActive) return '';
    
    const now = Date.now();
    const elapsed = (now - parkingTimer.startTime) / (1000 * 60); // in minutes
    const remaining = Math.max(0, parkingTimer.duration - elapsed);
    
    return formatTime(Math.round(remaining));
  };

  const handleStartTimer = () => {
    startParkingTimer(duration);
  };

  const handleStopTimer = () => {
    stopParkingTimer();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Parking Timer</DialogTitle>
        </DialogHeader>
        
        {isTimerActive ? (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-lg font-medium">Time Remaining</p>
              <p className="text-4xl font-bold text-parkpal-primary mt-2">{calculateTimeRemaining()}</p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleStopTimer}
                variant="destructive"
              >
                Stop Timer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label htmlFor="duration" className="text-sm font-medium">
                  Parking Duration
                </label>
                <span className="text-sm font-semibold">{formatTime(duration)}</span>
              </div>
              <Slider
                id="duration"
                min={15}
                max={240}
                step={15}
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>15m</span>
                <span>4h</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleStartTimer}>Start Timer</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ParkingTimer;
