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
    };

    init();
  }, []);
}
