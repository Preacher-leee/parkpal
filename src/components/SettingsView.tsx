
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

const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6">
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
            <Label htmlFor="auto-detect" className="flex-1">
              Auto-detect parking
              <p className="text-sm font-normal text-parkpal-subtleText">
                Automatically detect when you've parked
              </p>
            </Label>
            <Switch id="auto-detect" />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="location-services" className="flex-1">
              Location services
              <p className="text-sm font-normal text-parkpal-subtleText">
                Allow app to access your location
              </p>
            </Label>
            <Switch id="location-services" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex-1">
              Notifications
              <p className="text-sm font-normal text-parkpal-subtleText">
                Receive parking alerts and reminders
              </p>
            </Label>
            <Switch id="notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Manage your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="stealth-mode" className="flex-1">
              Stealth mode
              <p className="text-sm font-normal text-parkpal-subtleText">
                Only track location when manually activated
              </p>
            </Label>
            <Switch id="stealth-mode" />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="data-collection" className="flex-1">
              Data collection
              <p className="text-sm font-normal text-parkpal-subtleText">
                Allow anonymous usage data collection
              </p>
            </Label>
            <Switch id="data-collection" defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Premium Features</CardTitle>
          <CardDescription>Upgrade to access premium features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start">
              <div className="bg-parkpal-primary/10 rounded-full p-1 mr-3 mt-0.5">
                <div className="w-4 h-4 bg-parkpal-primary rounded-full" />
              </div>
              <div>
                <p className="font-medium">Smart Alerts</p>
                <p className="text-sm text-parkpal-subtleText">
                  Get alerts when you're parked in time-limited zones
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-parkpal-primary/10 rounded-full p-1 mr-3 mt-0.5">
                <div className="w-4 h-4 bg-parkpal-primary rounded-full" />
              </div>
              <div>
                <p className="font-medium">Multiple Vehicle Profiles</p>
                <p className="text-sm text-parkpal-subtleText">
                  Track multiple vehicles simultaneously
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-parkpal-primary/10 rounded-full p-1 mr-3 mt-0.5">
                <div className="w-4 h-4 bg-parkpal-primary rounded-full" />
              </div>
              <div>
                <p className="font-medium">Home Screen Widget</p>
                <p className="text-sm text-parkpal-subtleText">
                  Quick access to park or find your car
                </p>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-4">
            Upgrade to Premium
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
