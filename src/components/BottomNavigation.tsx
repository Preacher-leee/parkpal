
import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Clock, Settings } from 'lucide-react';

type Props = {
  activeView: string;
  onChange: (view: string) => void;
};

const BottomNavigation: React.FC<Props> = ({ activeView, onChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-white parkpal-shadow z-50">
      <button
        onClick={() => onChange('map')}
        className={cn(
          'flex flex-col items-center justify-center w-1/3 h-full transition-colors',
          activeView === 'map' ? 'text-parkpal-primary' : 'text-parkpal-subtleText'
        )}
      >
        <MapPin size={22} />
        <span className="text-xs mt-1">Map</span>
      </button>
      <button
        onClick={() => onChange('history')}
        className={cn(
          'flex flex-col items-center justify-center w-1/3 h-full transition-colors',
          activeView === 'history' ? 'text-parkpal-primary' : 'text-parkpal-subtleText'
        )}
      >
        <Clock size={22} />
        <span className="text-xs mt-1">History</span>
      </button>
      <button
        onClick={() => onChange('settings')}
        className={cn(
          'flex flex-col items-center justify-center w-1/3 h-full transition-colors',
          activeView === 'settings' ? 'text-parkpal-primary' : 'text-parkpal-subtleText'
        )}
      >
        <Settings size={22} />
        <span className="text-xs mt-1">Settings</span>
      </button>
    </div>
  );
};

export default BottomNavigation;
