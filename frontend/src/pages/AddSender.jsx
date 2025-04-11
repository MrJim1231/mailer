import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/SendEmail.module.css'

const AddSender = () => {
  const [senderName, setSenderName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // Состояние для отображения/скрытия пароля

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!senderName || !email || !password || !adminEmail) {
      setStatus('Пожалуйста, заполните все поля.')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost/mailer/backend/api/add_sender.php',
        {
          senderName,
          email,
          password,
          adminEmail,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Указываем, что отправляем JSON
          },
        }
      )

      if (response.data.status === 'success') {
        setStatus('Отправитель успешно добавлен!')
      } else {
        setStatus('Не удалось добавить отправителя: ' + response.data.message)
      }
    } catch (error) {
      setStatus('Ошибка при добавлении отправителя.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2>Добавить нового отправителя</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Имя отправителя:</label>
          <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Email отправителя:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Пароль отправителя:</label>
          <div className={styles.passwordContainer}>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label className={styles.showPasswordLabel}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)} // Переключаем состояние при изменении
              />
              Показать пароль
            </label>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Email администратора:</label>
          <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Добавление...' : 'Добавить отправителя'}
        </button>
      </form>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  )
}

export default AddSender
