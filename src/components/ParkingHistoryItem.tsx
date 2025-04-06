
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { ParkingLocation } from '@/types';
import { MapPin, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParkingHistoryItemProps {
  parking: ParkingLocation;
}

const ParkingHistoryItem: React.FC<ParkingHistoryItemProps> = ({ parking }) => {
  const formattedDate = format(new Date(parking.timestamp), 'MMM d, yyyy • h:mm a');
  
  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${parking.coordinates.latitude},${parking.coordinates.longitude}&travelmode=walking`;
    window.open(url, '_blank');
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-parkpal-subtleText">{formattedDate}</p>
            <h3 className="font-medium mt-0.5">
              {parking.address || 'Unknown Location'}
            </h3>
            {parking.notes && (
              <p className="text-sm mt-1">{parking.notes}</p>
            )}
            {parking.duration && (
              <div className="flex items-center text-xs text-parkpal-subtleText mt-2">
                <Timer size={14} className="mr-1" />
                <span>{parking.duration} min parking limit</span>
              </div>
            )}
          </div>
          <Button
            size="sm" 
            className="ml-2 shrink-0 h-9 w-9 p-0" 
            onClick={handleNavigate}
          >
            <MapPin size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingHistoryItem;
