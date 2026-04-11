import * as React from 'react'
import ReactDOM from 'react-dom/client'

// react-quill expects React as a global in bundled builds
window.React = React;
import App from '@/App.jsx'
import '@/index.css'

// Unregister any existing service workers to clear bad cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(r => r.unregister());
  }).catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)