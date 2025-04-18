import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mic, Wallet, Wifi, WifiOff, CreditCard, Car, Bell, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Stripe checkout URL provided by the user
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_6oE4ho8aq3E86L6eUU";

const SettingsView: React.FC = () => {
  const [isOffline, setIsOffline] = React.useState(false);
  const [isAutoDetectEnabled, setIsAutoDetectEnabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePremiumUpgrade = async () => {
    if (!user) {
      toast("Please sign in to upgrade to Premium", {
        description: "You need an account to subscribe to Premium features",
        action: {
          label: "Sign In",
          onClick: () => navigate('/auth')
        }
      });
      return;
    }

    try {
      setIsLoading(true);
      // Redirect to the Stripe checkout URL
      window.location.href = STRIPE_CHECKOUT_URL;
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      toast.error("Couldn't process your request", {
        description: "Please try again later or contact support."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 px-4">
      <div className="mb-6 pt-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-parkpal-subtleText">Customize your ParkPal experience</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>App Settings</CardTitle>
          <CardDescription>Configure how ParkPal works</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="offline-mode" className="flex items-center gap-2">
              {isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
              <div>
                <span className="block">Offline Mode</span>
                <p className="text-sm font-normal text-parkpal-subtleText">
                  Use app without an internet connection
                </p>
              </div>
            </Label>
            <Switch 
              id="offline-mode" 
              checked={isOffline} 
              onCheckedChange={setIsOffline}
              aria-label="Offline Mode Toggle"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-detect" className="flex items-center gap-2">
              <Car size={16} />
              <div>
                <span className="block">Auto-detect parking</span>
                <p className="text-sm font-normal text-parkpal-subtleText">
                  Automatically detect when you've parked
                </p>
              </div>
            </Label>
            <Switch 
              id="auto-detect" 
              checked={isAutoDetectEnabled} 
              onCheckedChange={setIsAutoDetectEnabled} 
              aria-label="Auto-detect Parking Toggle"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <div>
                <span className="block">Notifications</span>
                <p className="text-sm font-normal text-parkpal-subtleText">
                  Receive parking alerts and reminders
                </p>
              </div>
            </Label>
            <Switch 
              id="notifications" 
              defaultChecked
              disabled={isLoading}
              aria-label="Notifications Toggle"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-parkpal-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-parkpal-primary/10 rounded-full p-1">
              <CreditCard className="h-5 w-5 text-parkpal-primary" />
            </div>
            <CardTitle>Premium Features</CardTitle>
          </div>
          <CardDescription>Upgrade to access premium features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start">
              <div className="bg-parkpal-primary/10 rounded-full p-1 mr-3 mt-0.5">
                <Mic className="w-4 h-4 text-parkpal-primary" />
              </div>
              <div>
                <p className="font-medium">Voice Control</p>
                <p className="text-sm text-parkpal-subtleText">
                  "Hey ParkPal, where's my car?" or "ParkPal, find my car"
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-parkpal-primary/10 rounded-full p-1 mr-3 mt-0.5">
                <Wallet className="w-4 h-4 text-parkpal-primary" />
              </div>
              <div>
                <p className="font-medium">In-App Wallet</p>
                <p className="text-sm text-parkpal-subtleText">
                  Add payment methods and auto-pay parking meters
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-parkpal-primary/10 rounded-full p-1 mr-3 mt-0.5">
                <div className="w-4 h-4 bg-parkpal-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
              </div>
              <div>
                <p className="font-medium">Tap-to-Pay</p>
                <p className="text-sm text-parkpal-subtleText">
                  Connect to partner meter systems for contactless payment
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4 bg-gradient-to-r from-parkpal-primary to-blue-500 hover:from-parkpal-primary/90 hover:to-blue-600"
            onClick={handlePremiumUpgrade}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Upgrade to Premium"
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>About</CardTitle>
          <CardDescription>App information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">ParkPal v1.0.0</p>
          <p className="text-sm text-parkpal-subtleText mt-1">© 2025 TLee Apps</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsView;
