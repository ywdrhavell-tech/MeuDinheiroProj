import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { FinanceProvider } from './contexto/FinanceContext'
import App from './App'
import './estilos.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><HashRouter><FinanceProvider><App /></FinanceProvider></HashRouter></React.StrictMode>
)
