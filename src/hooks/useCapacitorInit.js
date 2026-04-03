import { useEffect } from 'react';

/**
 * Initializes Capacitor native plugins when running in a native shell.
 * Gracefully no-ops when running in the browser.
 */
export default function useCapacitorInit() {
  useEffect(() => {
    const init = async () => {
      try {
        // Status bar — transparent overlay for safe-area content
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch {
        // Not running in Capacitor — ignore
      }

      try {
        // Keyboard — resize body on keyboard show
        const { Keyboard } = await import('@capacitor/keyboard');
        Keyboard.addListener('keyboardWillShow', () => {
          document.body.classList.add('keyboard-open');
        });
        Keyboard.addListener('keyboardWillHide', () => {
          document.body.classList.remove('keyboard-open');
        });
      } catch {
        // Not running in Capacitor — ignore
      }

      try {
        // Splash screen — hide after app renders
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide({ fadeOutDuration: 300 });
      } catch {
        // Not running in Capacitor — ignore
      }

      try {
        // App plugin — handle back button and deep links
        const { App } = await import('@capacitor/app');
        App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            App.exitApp();
          }
        });
      } catch {
        // Not running in Capacitor — ignore
      }

      // ── App Tracking Transparency (iOS 14.5+) ──
      try {
        const { AppTrackingTransparency } = await import('@capacitor/app-tracking-transparency');
        const status = await AppTrackingTransparency.getStatus();
        if (status.status === 'notDetermined') {
          await AppTrackingTransparency.requestPermission();
        }
      } catch {
        // Plugin not installed or not on iOS — ignore
      }

      // ── Local Notifications (native) ──
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        const perm = await LocalNotifications.checkPermissions();
        if (perm.display === 'prompt') {
          await LocalNotifications.requestPermissions();
        }
      } catch {
        // Plugin not installed — web notifications handle this
      }

      // ── Health Kit / Google Fit (wearable integration) ──
      try {
        const { HealthConnect } = await import('@anthropic/capacitor-health-connect');
        const granted = await HealthConnect.requestPermissions({
          permissions: ['steps', 'activeCaloriesBurned', 'heartRate'],
        });
        if (granted) {
          // Store flag so workout pages can show synced data
          localStorage.setItem('pr_health_connected', 'true');
        }
      } catch {
        // Health plugin not installed — ignore
        // Will be set up when native shell is built
      }
    };

    init();
  }, []);
}
