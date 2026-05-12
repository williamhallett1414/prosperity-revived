import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

// ── Install-seen flag ──────────────────────────────────────────────────────
// Stored in localStorage to detect "fresh install with an inherited token"
// (a WKWebView cache survival case flagged by Base44 support). On a fresh
// install we may still see a token in localStorage if iOS preserved the
// webview's storage across uninstall+reinstall; in that case the token
// belongs to a previous user/session and must be cleared so the user lands
// on /login. The flag is set only after our own /login or /signup flow
// successfully authenticates a user.
const INSTALL_SEEN_KEY = 'pr_install_seen';

const hasInstallSeenFlag = () => {
  try {
    return typeof window !== 'undefined'
      && !!window.localStorage
      && window.localStorage.getItem(INSTALL_SEEN_KEY) === '1';
  } catch (_e) {
    return false;
  }
};

const writeInstallSeenFlag = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(INSTALL_SEEN_KEY, '1');
    }
  } catch (_e) {}
};

// Read the current access token from localStorage. The Base44 SDK writes
// to 'base44_access_token' after loginViaEmailPassword(), but the
// appParams.token in-memory copy is captured at module-init time and does
// NOT auto-refresh — so we need to manually re-read it before every
// auth-sensitive operation.
const readTokenFromStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('base44_access_token') || null;
    }
  } catch (_e) {}
  return null;
};

// Clear all auth-related state from this device. Runs synchronously before
// any network request so the inherited token never gets used.
const purgeInheritedToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('base44_access_token');
      window.localStorage.removeItem('token');
    }
  } catch (_e) {}
  // Wipe the in-memory copy that the SDK and appParams already captured at
  // module-init time. Without this, the SDK would still send the stale token
  // on the very next API call.
  try { base44.auth.setToken('', false); } catch (_e) {}
  try { appParams.token = null; } catch (_e) {}
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      // Refresh appParams.token from localStorage. The SDK writes a fresh
      // token to localStorage after loginViaEmailPassword(), but the
      // appParams.token captured at module-init may be stale (especially
      // after a boot-time purge nulled it out). Re-read before every
      // auth-sensitive run so post-login checkAppState() calls see the
      // newly-issued token.
      appParams.token = readTokenFromStorage();

      // Fresh-install guard: if there's a token but we've never marked this
      // install as having gone through our login flow, the token was inherited
      // from a previous install's webview cache. Wipe it before any auth
      // request so the inherited identity is never used.
      if (appParams.token && !hasInstallSeenFlag()) {
        purgeInheritedToken();
      }

      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      try {
        const headers = { 'X-App-Id': appParams.appId };
        if (appParams.token) headers['Authorization'] = `Bearer ${appParams.token}`;
        const res = await fetch(`/api/apps/public/prod/public-settings/by-id/${appParams.appId}`, { headers });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const err = new Error(errData?.message || 'Failed to load app');
          err.response = { status: res.status, data: errData };
          throw err;
        }
        const publicSettings = await res.json();
        setAppPublicSettings(publicSettings);
        
        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed:', appError);
        
        // Handle app-level errors
        const status = appError.response?.status;
        const reason = appError.response?.data?.extra_data?.reason;
        if (status === 403 && reason) {
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({ type: reason, message: appError.message });
          }
        } else {
          setAuthError({ type: 'unknown', message: appError.message || 'Failed to load app' });
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      // Now check if the user is authenticated
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();

      // If this account was deleted, block re-login immediately
      if (currentUser?.deleted_at) {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        setAuthError({ type: 'account_deleted', message: 'This account has been permanently deleted.' });
        // Force logout to clear tokens
        try {
          window.localStorage.removeItem('base44_access_token');
          window.localStorage.removeItem('token');
          localStorage.clear();
        } catch (_e) {}
        return;
      }

      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      
      // If user auth fails, it might be an expired token
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);

    // Clear local tokens directly. Don't rely on base44.auth.logout() because
    // its built-in redirect uses ${options.appBaseUrl} which can be null when
    // the env var isn't set, producing broken URLs like 'null/login?...'.
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('base44_access_token');
        window.localStorage.removeItem('token');
      } catch (_e) {}
    }
    // Also clear the SDK's in-memory token so subsequent requests don't try
    // to use a stale Authorization header.
    try { base44.auth.setToken('', false); } catch (_e) {}

    if (shouldRedirect && typeof window !== 'undefined') {
      // Custom in-app login: route to /login instead of redirecting to a
      // Base44-hosted logout endpoint (which doesn't exist in our native
      // Capacitor build context).
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    // Custom in-app login: route to our own /login page instead of using
    // base44.auth.redirectToLogin() which would send the user to Base44's
    // hosted login (broken in Capacitor + we want to hide Google/Apple).
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
      markInstallSeen: writeInstallSeenFlag,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};