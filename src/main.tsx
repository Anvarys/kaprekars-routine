import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-expect-error Vite loads this stylesheet at runtime; TypeScript has no CSS declaration.
import './index.css'
import IntroPage from './pages/Intro.tsx'
import SimpleVisualisationPage from './pages/SimpleVisualisation.tsx'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import "@fontsource/kavivanar"
import { readLocalStorage } from './utils.ts'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={readLocalStorage("showIntro", true) ? "/intro" : readLocalStorage("lastPage", "/intro")} replace />} />

        <Route path="/intro" element={<IntroPage />} />
        
        <Route path='/visualisation'>
          <Route path='simple' element={<SimpleVisualisationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
