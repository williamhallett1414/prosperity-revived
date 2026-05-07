import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    // If we just logged out via the Sign Out button, force a redirect to the
    // login page. The flag is set by logout() before navigating to the
    // server-side logout endpoint, and survives the round-trip back into
    // the app via sessionStorage.
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        if (window.sessionStorage.getItem('post_logout_redirect_to_login') === '1') {
          window.sessionStorage.removeItem('post_logout_redirect_to_login');
          // Use a SAME-ORIGIN relative URL so we don't depend on
          // appParams.appBaseUrl being set (it can be null in some envs).
          const fromUrl = encodeURIComponent('/');
          window.location.href = `/login?from_url=${fromUrl}`;
          return;
        }
      }
    } catch (_e) {}
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
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

    if (shouldRedirect && typeof window !== 'undefined') {
      // Use a SAME-ORIGIN relative URL to hit Base44's logout endpoint. This
      // works regardless of whether appBaseUrl is set, since the app and the
      // auth endpoints are served from the same Base44 origin in production.
      // After server-side cookie clearing, Base44 redirects to from_url ('/'),
      // and we use a sessionStorage flag to trigger the actual login redirect
      // on the next page load (handled in AuthContext's useEffect).
      try {
        window.sessionStorage.setItem('post_logout_redirect_to_login', '1');
      } catch (_e) {}
      const fromUrl = encodeURIComponent('/');
      window.location.href = `/api/apps/auth/logout?from_url=${fromUrl}`;
    }
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    base44.auth.redirectToLogin(window.location.href);
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
      checkAppState
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