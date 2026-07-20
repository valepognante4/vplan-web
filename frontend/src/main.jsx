import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error(
    '[VPlan] ⚠️  VITE_GOOGLE_CLIENT_ID no está definido.\n' +
    'Asegurate de que el archivo frontend/.env contiene:\n' +
    'VITE_GOOGLE_CLIENT_ID=<tu-client-id>.apps.googleusercontent.com'
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)

