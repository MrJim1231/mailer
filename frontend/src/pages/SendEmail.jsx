import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/SendEmail.module.css'

const SendEmail = () => {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('') // Новое состояние для темы письма
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [sender, setSender] = useState('1')
  const [senders, setSenders] = useState([])
  const [ip, setIp] = useState('')

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        const response = await axios.get('http://localhost/mailer/backend/api/get_senders.php')
        if (response.data.status === 'success') {
          setSenders(response.data.senders)
        } else {
          setStatus('Не удалось загрузить список отправителей.')
        }
      } catch (error) {
        setStatus('Ошибка при загрузке отправителей.')
        console.error('Ошибка:', error)
      }
    }

    fetchSenders()
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(selectedFile.type)) {
        setStatus('Неверный тип файла. Поддерживаются только PDF, TXT и DOCX.')
        return
      }
      setFile(selectedFile)
      setStatus('')
    }
  }

  const getIpAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json')
      console.log('Полученный IP:', response.data.ip)
      setIp(response.data.ip)
    } catch (error) {
      console.error('Ошибка при получении IP:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !subject) {
      setStatus('Пожалуйста, укажите email и тему письма.')
      return
    }

    await getIpAddress()
    console.log('IP перед отправкой формы:', ip)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('subject', subject) // Добавляем тему письма
    formData.append('message', message)
    formData.append('sender', sender)
    formData.append('ip', ip)
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
          <label>Тема письма:</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Сообщение (можно оставить пустым):</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Выберите отправителя:</label>
          <select value={sender} onChange={(e) => setSender(e.target.value)} required>
            {senders.length > 0 ? (
              senders.map((sender) => (
                <option key={sender.id} value={sender.id}>
                  {sender.senderName} ({sender.mailUsername})
                </option>
              ))
            ) : (
              <option value="">Загружается...</option>
            )}
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
