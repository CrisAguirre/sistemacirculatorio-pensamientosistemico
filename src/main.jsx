import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ServerStatusProvider } from './context/ServerStatusContext.jsx'
import { PreloaderProvider } from './hooks/usePreloader.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ServerStatusProvider>
        <AuthProvider>
          <PreloaderProvider>
            <App />
          </PreloaderProvider>
        </AuthProvider>
      </ServerStatusProvider>
    </BrowserRouter>
  </StrictMode>,
)
