
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network: Online');
      setIsOnline(true);
      setShowOfflineMessage(false);
      
      if (!navigator.onLine === false) {
        setShowOnlineMessage(true);
        setIsDismissed(false);
        
        // Auto-hide online message after 3 seconds
        setTimeout(() => {
          setShowOnlineMessage(false);
        }, 3000);
      }
    };

    const handleOffline = () => {
      console.log('Network: Offline');
      setIsOnline(false);
      setShowOfflineMessage(true);
      setShowOnlineMessage(false);
      setIsDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    if (!navigator.onLine) {
      setShowOfflineMessage(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowOfflineMessage(false);
    setShowOnlineMessage(false);
  };

  if (isDismissed) return null;
  if (!showOfflineMessage && !showOnlineMessage) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-300">
      <Alert 
        variant={isOnline && showOnlineMessage ? "default" : "destructive"} 
        className="rounded-none border-0 shadow-lg"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {isOnline && showOnlineMessage ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            <AlertDescription className="font-medium">
              {isOnline && showOnlineMessage
                ? "Connexion rétablie - Vous êtes de nouveau en ligne" 
                : "Pas de connexion internet - Certaines fonctionnalités peuvent être limitées"
              }
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default OfflineIndicator;
