import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SendEmail from './pages/SendEmail'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/send-email" element={<SendEmail />} />
      </Routes>
    </Router>
  )
}

export default App
