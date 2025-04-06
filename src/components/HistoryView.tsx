
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useParkingContext } from '@/context/ParkingContext';
import ParkingHistoryItem from './ParkingHistoryItem';

const HistoryView: React.FC = () => {
  const { parkingHistory, searchHistory } = useParkingContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredHistory = searchQuery ? searchHistory(searchQuery) : parkingHistory;

  return (
    <div className="h-full pb-20">
      <div className="sticky top-0 bg-parkpal-background py-4 z-10">
        <div className="relative">
          <Search 
            size={18} 
            className="absolute top-2.5 left-3 text-parkpal-subtleText" 
          />
          <Input
            placeholder="Search parking history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {filteredHistory.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-parkpal-subtleText text-center">
            {searchQuery ? 'No matching parking records found' : 'No parking history yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {filteredHistory.map((parking) => (
            <ParkingHistoryItem key={parking.id} parking={parking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
