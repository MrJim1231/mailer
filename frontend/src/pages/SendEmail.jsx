import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/SendEmail.module.css' // стиль для страницы

const SendEmail = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      name,
      email,
      message,
    }

    setLoading(true) // Устанавливаем состояние загрузки

    try {
      // Путь на прямую без API_URL
      const response = await axios.post('http://localhost/mailer/backend/api/send_email.php', data)

      if (response.status === 200) {
        setStatus('Сообщение успешно отправлено!')
      }
    } catch (error) {
      setStatus('Не удалось отправить сообщение.')
      console.error('Ошибка при отправке:', error)
    } finally {
      setLoading(false) // Снимаем состояние загрузки
    }
  }

  return (
    <div className={styles.container}>
      <h2>Отправка письма</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Ваше имя:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Ваш email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Сообщение:</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Отправка...' : 'Отправить сообщение'}
        </button>
      </form>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  )
}

export default SendEmail
