import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/SendEmail.module.css'

const DeleteSender = () => {
  const [senders, setSenders] = useState([]) // Массив с отправителями
  const [selectedSender, setSelectedSender] = useState('') // Выбранный отправитель
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  // Функция для загрузки списка отправителей
  const fetchSenders = async () => {
    try {
      const response = await axios.get('http://localhost/mailer/backend/api/get_senders.php')
      if (response.data.status === 'success') {
        setSenders(response.data.senders)
      } else {
        console.error('Не удалось загрузить список отправителей:', response.data.message)
        setStatus('Не удалось загрузить список отправителей.')
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
      setStatus('Ошибка при загрузке данных.')
    }
  }

  useEffect(() => {
    fetchSenders()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedSender) {
      setStatus('Пожалуйста, выберите отправителя для удаления.')
      return
    }

    setLoading(true)
    setStatus('')

    try {
      const response = await axios.post('http://localhost/mailer/backend/api/delete_sender.php', { senderId: selectedSender }, { headers: { 'Content-Type': 'application/json' } })

      if (response.data.status === 'success') {
        setStatus('Отправитель успешно удален.')
        setSelectedSender('') // Сброс выбранного отправителя
        fetchSenders() // Перезагрузка списка отправителей
      } else {
        setStatus('Не удалось удалить отправителя: ' + response.data.message)
      }
    } catch (error) {
      console.error('Ошибка при удалении отправителя:', error)
      setStatus('Ошибка при удалении отправителя.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2>Удалить отправителя</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Выберите отправителя для удаления:</label>
          <select value={selectedSender} onChange={(e) => setSelectedSender(e.target.value)} required>
            <option value="">-- Выберите отправителя --</option>
            {senders.map((sender) => (
              <option key={sender.id} value={sender.id}>
                {sender.senderName} ({sender.mailUsername})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Удаление...' : 'Удалить отправителя'}
        </button>
      </form>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  )
}

export default DeleteSender
