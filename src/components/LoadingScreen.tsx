
import React from 'react';
import { Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-parkpal-primary flex flex-col items-center justify-center z-50">
      <div className="mb-8">
        <img 
          src="/lovable-uploads/c9cc4aef-57c5-4504-b4d7-15762549e75e.png" 
          alt="ParkPal" 
          className="w-48 h-auto animate-pulse-gentle" 
        />
      </div>
      
      <div className="space-y-4 w-64">
        <Skeleton className="h-2 w-full bg-white/20" />
        <div className="flex justify-center">
          <Loader className="text-white animate-spin" size={30} />
        </div>
        <p className="text-white text-center mt-4 text-sm">Finding your perfect spot...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
