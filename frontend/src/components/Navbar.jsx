import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            Главная
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/send-email" className="navbar-link">
            Отправить email
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
