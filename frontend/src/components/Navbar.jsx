import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Navbar.module.css' // Подключение стилей для Navbar

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/" className={styles.logoLink}>
          Mailer
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/send-email" className={styles.navLink}>
          Отправить сообщение
        </Link>
        <Link to="/add-sender" className={styles.navLink}>
          Добавить отправителя
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
