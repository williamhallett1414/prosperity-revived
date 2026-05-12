import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { appParams } from '@/lib/app-params';

/**
 * TEMPORARY DEBUG BANNER — surfaces auth state at the top of the app so we
 * can diagnose the TestFlight auto-login issue. REMOVE before App Store
 * submission. Mounted from App.jsx above AuthenticatedApp.
 */
export default function AuthDebugBanner() {
  const { user, isAuthenticated, isLoadingAuth, authError } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [copiedAt, setCopiedAt] = useState(null);

  // Read raw storage values once on mount
  const [storage, setStorage] = useState({});
  useEffect(() => {
    try {
      setStorage({
        base44_access_token: typeof window !== 'undefined' && window.localStorage
          ? window.localStorage.getItem('base44_access_token')
          : null,
        token: typeof window !== 'undefined' && window.localStorage
          ? window.localStorage.getItem('token')
          : null,
        base44_app_id: typeof window !== 'undefined' && window.localStorage
          ? window.localStorage.getItem('base44_app_id')
          : null,
        base44_app_base_url: typeof window !== 'undefined' && window.localStorage
          ? window.localStorage.getItem('base44_app_base_url')
          : null,
      });
    } catch (_e) {
      setStorage({ error: 'localStorage unavailable' });
    }
  }, []);

  const tokenPresent = !!appParams.token;
  const tokenLen = appParams.token ? String(appParams.token).length : 0;
  const tokenPrefix = appParams.token ? String(appParams.token).slice(0, 6) : '∅';
  const userIdShort = user?.id ? String(user.id).slice(0, 8) : '∅';
  const emailDomain = user?.email && user.email.includes('@')
    ? '@' + user.email.split('@')[1]
    : (user?.email || '∅');
  const userName = user?.full_name || user?.name || '∅';
  const origin = typeof window !== 'undefined' ? window.location.origin : '∅';
  const href = typeof window !== 'undefined' ? window.location.href : '∅';
  const isCapacitor = origin.startsWith('capacitor://') || origin.startsWith('ionic://');

  const summary = `Auth=${isAuthenticated ? '✓' : '✗'} Tok=${tokenPresent ? tokenPrefix + '…(' + tokenLen + ')' : '∅'} User=${userIdShort} ${userName}`;

  const fullReport = [
    '=== Prosperity Revived Auth Debug ===',
    'Timestamp: ' + new Date().toISOString(),
    'Origin: ' + origin,
    'Capacitor: ' + isCapacitor,
    'Href: ' + href,
    '--- appParams ---',
    'appId: ' + (appParams.appId || '∅'),
    'appBaseUrl: ' + (appParams.appBaseUrl || '∅'),
    'functionsVersion: ' + (appParams.functionsVersion || '∅'),
    'token: ' + (tokenPresent ? `${tokenPrefix}… (len=${tokenLen})` : '∅'),
    '--- auth state ---',
    'isLoadingAuth: ' + isLoadingAuth,
    'isAuthenticated: ' + isAuthenticated,
    'authError: ' + (authError ? JSON.stringify(authError) : '∅'),
    '--- user from auth.me() ---',
    'user.id (first 8): ' + userIdShort,
    'user.email (domain): ' + emailDomain,
    'user.name: ' + userName,
    'user.created_date: ' + (user?.created_date || '∅'),
    '--- localStorage raw ---',
    'base44_access_token: ' + (storage.base44_access_token ? `${String(storage.base44_access_token).slice(0,6)}… (len=${String(storage.base44_access_token).length})` : '∅'),
    'token: ' + (storage.token ? `${String(storage.token).slice(0,6)}… (len=${String(storage.token).length})` : '∅'),
    'base44_app_id: ' + (storage.base44_app_id || '∅'),
    'base44_app_base_url: ' + (storage.base44_app_base_url || '∅'),
  ].join('\n');

  const copyReport = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullReport);
        setCopiedAt(Date.now());
        setTimeout(() => setCopiedAt(null), 2000);
      } else {
        // Fallback: select text in a textarea
        const ta = document.createElement('textarea');
        ta.value = fullReport;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopiedAt(Date.now());
        setTimeout(() => setCopiedAt(null), 2000);
      }
    } catch (_e) {
      setCopiedAt('error');
      setTimeout(() => setCopiedAt(null), 2000);
    }
  };

  const clearAllAndReload = () => {
    try {
      if (window.localStorage) window.localStorage.clear();
      if (window.sessionStorage) window.sessionStorage.clear();
    } catch (_e) {}
    window.location.reload();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 'env(safe-area-inset-top)',
        left: 0,
        right: 0,
        zIndex: 9999,
        background: isAuthenticated ? '#16a34a' : '#dc2626',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: 11,
        padding: '4px 8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
    >
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          🔍 {summary}
        </span>
        <span style={{ marginLeft: 8, fontSize: 14 }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 6, whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.4 }}>
          {fullReport}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              onClick={copyReport}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                color: 'white',
                padding: '6px 10px',
                borderRadius: 4,
                fontSize: 11,
                fontFamily: 'inherit',
                minHeight: 32,
              }}
            >
              {copiedAt === 'error' ? '✗ copy failed' : copiedAt ? '✓ copied' : '📋 copy report'}
            </button>
            <button
              onClick={clearAllAndReload}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                color: 'white',
                padding: '6px 10px',
                borderRadius: 4,
                fontSize: 11,
                fontFamily: 'inherit',
                minHeight: 32,
              }}
            >
              🗑️ clear storage + reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
