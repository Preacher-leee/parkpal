
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParkingProvider } from '@/context/ParkingContext';
import BottomNavigation from '@/components/BottomNavigation';
import MapView from '@/components/MapView';
import HistoryView from '@/components/HistoryView';
import SettingsView from '@/components/SettingsView';
import { View } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<View>('map');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
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
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-parkpal-primary">ParkPal</h1>
            {user ? (
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4 mr-2" /> Sign In
              </Button>
            )}
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
