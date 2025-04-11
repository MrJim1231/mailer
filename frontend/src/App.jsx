import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' // Используем Routes вместо Switch
import Navbar from './components/Navbar' // Путь к компоненту Navbar
import SendEmail from './pages/SendEmail' // Путь к странице SendEmail
import AddSender from './pages/AddSender' // Путь к странице AddSender

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          {' '}
          {/* Заменили Switch на Routes */}
          <Route path="/" element={<h1>Добро пожаловать на главную страницу</h1>} />
          <Route path="/send-email" element={<SendEmail />} />
          <Route path="/add-sender" element={<AddSender />} />
          {/* Добавьте другие маршруты здесь */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
