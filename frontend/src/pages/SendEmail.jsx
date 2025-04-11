import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/SendEmail.module.css'

const SendEmail = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('') // Сообщение теперь может быть пустым
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [sender, setSender] = useState('1') // Стейт для выбора отправителя

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(selectedFile.type)) {
        setStatus('Неверный тип файла. Поддерживаются только PDF, TXT и DOCX.')
        return
      }
      setFile(selectedFile)
      setStatus('') // Сбрасываем сообщение об ошибке
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      // Сделаем обязательным только поле email
      setStatus('Пожалуйста, укажите email.')
      return
    }

    const formData = new FormData()
    formData.append('email', email)
    formData.append('message', message || 'Сообщение не было оставлено.') // Если сообщение пустое, отправляется текст
    formData.append('sender', sender) // Добавляем выбор отправителя
    if (file) {
      formData.append('file', file)
    }

    setLoading(true)

    try {
      const response = await axios.post('http://localhost/mailer/backend/api/send_email.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200) {
        setStatus('Сообщение успешно отправлено!')
      }
    } catch (error) {
      setStatus('Не удалось отправить сообщение.')
      console.error('Ошибка при отправке:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2>Отправка письма</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Email куда отправлять письмо:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Сообщение (можно оставить пустым):</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Выберите отправителя:</label>
          <select value={sender} onChange={(e) => setSender(e.target.value)} required>
            <option value="1">Отправитель 1 (berolegnik@gmail.com)</option>
            <option value="2">Отправитель 2 (berezhnoioleh@gmail.com)</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Прикрепить файл (PDF, TXT, DOCX):</label>
          <input type="file" onChange={handleFileChange} />
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
