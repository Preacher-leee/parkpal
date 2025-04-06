
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const SettingsView: React.FC = () => {
  const { signOut, user } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Application Settings
          </CardTitle>
          <CardDescription>Configure your application settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-sm text-muted-foreground">Light (Coming soon)</p>
          </div>
          <div>
            <p className="text-sm font-medium">Notifications</p>
            <p className="text-sm text-muted-foreground">Enabled (Coming soon)</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <LogOut className="h-5 w-5" />
            Sign Out
          </CardTitle>
          <CardDescription>Sign out of your account</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="w-full"
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsView;
