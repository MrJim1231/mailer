import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SendEmail from './pages/SendEmail'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header-container">
          <Navbar />
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/send-email" element={<SendEmail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
