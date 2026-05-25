import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './i18n/context'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      if (reg.installing) {
        reg.installing.addEventListener('statechange', () => {
          if (reg.installing?.state === 'activated') window.location.reload()
        })
      }
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter><LanguageProvider><App /></LanguageProvider></BrowserRouter>
)
