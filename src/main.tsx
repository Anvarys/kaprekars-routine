import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-expect-error Vite loads this stylesheet at runtime; TypeScript has no CSS declaration.
import './index.css'
import LandingPage from './pages/Landing.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import "@fontsource/kavivanar"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
