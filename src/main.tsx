import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './estilos/Estilos globales.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
