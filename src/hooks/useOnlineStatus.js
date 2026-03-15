import { useState, useEffect } from 'react';

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Try Capacitor Network plugin first (native), fall back to browser events
    let removeCapListener = null;

    const initCapacitorNetwork = async () => {
      try {
        const { Network } = await import('@capacitor/network');
        const status = await Network.getStatus();
        setIsOnline(status.connected);
        const listener = await Network.addListener('networkStatusChange', (status) => {
          setIsOnline(status.connected);
        });
        removeCapListener = () => listener.remove();
      } catch {
        // Capacitor not available — use browser events
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        removeCapListener = () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    };

    initCapacitorNetwork();

    return () => {
      if (removeCapListener) removeCapListener();
    };
  }, []);

  return isOnline;
}
