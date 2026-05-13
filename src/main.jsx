import * as React from 'react'
import ReactDOM from 'react-dom/client'

// react-quill expects React as a global in bundled builds
window.React = React;
import App from '@/App.jsx'
import '@/index.css'

/**
 * Clear any service worker + cached responses from prior builds before rendering.
 *
 * Why: an earlier version of this app shipped with a service worker (public/sw.js)
 * that pre-cached the app shell. On iOS WKWebView, that service worker can survive
 * across sessions and continue serving a stale index.html from cache — including
 * an old bundle that still pointed at Base44's hosted login. Symptom: occasionally
 * a user sees the Base44 default login screen, and a refresh fixes it (because the
 * refresh races past the controlling SW once it's been unregistered).
 *
 * Fix: BLOCK startup until we've actively unregistered all SWs and wiped their
 * caches. We bound the wait at ~1.2s with Promise.race so a hanging API never
 * traps the user on a blank screen.
 */
async function purgeServiceWorkers() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister().catch(() => {})));
  } catch (_e) {}
  try {
    if (typeof caches !== 'undefined' && caches.keys) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k).catch(() => {})));
    }
  } catch (_e) {}
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise(resolve => setTimeout(resolve, ms)),
  ]);
}

async function boot() {
  // Don't let a stuck SW API hang the app forever — cap at 1.2s.
  await withTimeout(purgeServiceWorkers(), 1200);
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}

boot();
