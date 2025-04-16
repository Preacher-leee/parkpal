
import React, { useState } from 'react';
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
import Image from '@/components/ui/image';

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
        <header className="bg-white/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-20 parkpal-shadow">
          <div className="container mx-auto py-3 px-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Image 
                src="/lovable-uploads/0e8d7186-739b-4184-838b-3a4558ed25d6.png" 
                alt="ParkPal Logo" 
                className="h-8 w-8 text-parkpal-primary fill-parkpal-primary"
                blur
              />
              <h1 className="text-xl font-bold text-parkpal-primary">ParkPal</h1>
            </div>
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-parkpal-primary">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="text-parkpal-primary">
                <LogIn className="h-4 w-4 mr-2" /> Sign In
              </Button>
            )}
          </div>
        </header>
        <main className="pt-14">
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
