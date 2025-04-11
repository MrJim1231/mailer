import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/EmailHistory.module.css'

const EmailHistory = () => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  useEffect(() => {
    // Функция для получения истории сообщений
    const fetchEmailHistory = async () => {
      try {
        const response = await axios.get('http://localhost/mailer/backend/api/get_email_history.php')
        if (response.data && response.data.length > 0) {
          setEmails(response.data) // Сохраняем полученные данные
        } else {
          setStatus('История сообщений пуста.')
        }
      } catch (error) {
        setStatus('Ошибка при загрузке истории сообщений.')
        console.error('Ошибка:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmailHistory()
  }, [])

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div className={styles.container}>
      <h2>История отправленных сообщений</h2>
      {status && <p className={styles.status}>{status}</p>}
      {emails.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя отправителя</th>
              <th>Email отправителя</th>
              <th>Email получателя</th>
              <th>Сообщение</th>
              <th>Дата отправки</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id}>
                <td>{email.sender_name}</td>
                <td>{email.sender_email}</td>
                <td>{email.recipient_email}</td>
                <td>{email.message}</td>
                <td>{new Date(email.send_time).toLocaleString()}</td>
                <td>{email.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>История сообщений пуста.</p>
      )}
    </div>
  )
}

export default EmailHistory
