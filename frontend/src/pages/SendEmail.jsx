import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/SendEmail.module.css' // стиль для страницы

const SendEmail = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null) // Состояние для файла
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

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

    if (!name || !email || !message) {
      setStatus('Пожалуйста, заполните все обязательные поля.')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('message', message)
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
