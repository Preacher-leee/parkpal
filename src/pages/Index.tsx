
import React, { useState } from 'react';
import { ParkingProvider } from '@/context/parking/ParkingContext';
import BottomNavigation from '@/components/BottomNavigation';
import MapView from '@/components/MapView';
import HistoryView from '@/components/HistoryView';
import SettingsView from '@/components/SettingsView';
import { View } from '@/types';

const Index = () => {
  const [activeView, setActiveView] = useState<View>('map');
  
  const renderView = () => {
    switch (activeView) {
      case 'map':
        return <MapView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MapView />;
    }
  };

  return (
    <ParkingProvider>
      <div className="min-h-screen bg-parkpal-background">
        <header className="bg-white parkpal-shadow">
          <div className="container mx-auto py-4 px-4">
            <h1 className="text-xl font-bold text-parkpal-primary">ParkPal</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-4">
          <div className="pb-16">
            {renderView()}
          </div>
        </main>
        <BottomNavigation activeView={activeView} onChange={(view) => setActiveView(view as View)} />
      </div>
    </ParkingProvider>
  );
};

export default Index;
