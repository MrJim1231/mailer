import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' // Используем Routes вместо Switch
import Navbar from './components/Navbar' // Путь к компоненту Navbar
import SendEmail from './pages/SendEmail' // Путь к странице SendEmail
import AddSender from './pages/AddSender' // Путь к странице AddSender
import DeleteSender from './pages/DeleteSender' // Путь к странице DeleteSender (страница удаления отправителя)
import Instructions from './pages/Instructions' // Путь к странице инструкций
import EmailHistory from './pages/EmailHistory' // Путь к странице истории сообщений

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<h1>Добро пожаловать на главную страницу</h1>} />
          {/* Страница для отправки сообщения */}
          <Route path="/send-email" element={<SendEmail />} />
          {/* Страница для добавления нового отправителя */}
          <Route path="/add-sender" element={<AddSender />} />
          {/* Страница для удаления отправителя */}
          <Route path="/delete-sender" element={<DeleteSender />} />
          {/* Страница инструкций */}
          <Route path="/instructions" element={<Instructions />} />
          {/* Страница истории сообщений */}
          <Route path="/email-history" element={<EmailHistory />} /> {/* Новый маршрут */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
