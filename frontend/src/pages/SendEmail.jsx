import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/SendEmail.module.css'

const SendEmail = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('') // Сообщение теперь может быть пустым
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [sender, setSender] = useState('1') // Стейт для выбора отправителя
  const [senders, setSenders] = useState([]) // Стейт для списка отправителей
  const [ip, setIp] = useState('') // Стейт для хранения IP-адреса

  useEffect(() => {
    // Получаем список отправителей при монтировании компонента
    const fetchSenders = async () => {
      try {
        const response = await axios.get('http://localhost/mailer/backend/api/get_senders.php')
        if (response.data.status === 'success') {
          setSenders(response.data.senders) // Сохраняем список отправителей
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
      setStatus('') // Сбрасываем сообщение об ошибке
    }
  }

  const getIpAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json')
      console.log('Полученный IP:', response.data.ip) // Выводим IP в консоль
      setIp(response.data.ip)
    } catch (error) {
      console.error('Ошибка при получении IP:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      // Сделаем обязательным только поле email
      setStatus('Пожалуйста, укажите email.')
      return
    }

    // Получаем IP-адрес перед отправкой
    await getIpAddress()

    // После получения IP, проверим его значение
    console.log('IP перед отправкой формы:', ip)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('message', message) // Пустое сообщение теперь можно отправлять
    formData.append('sender', sender) // Добавляем выбор отправителя
    formData.append('ip', ip) // Добавляем IP-адрес
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
