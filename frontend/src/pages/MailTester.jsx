import React from 'react'
import styles from '../styles/MailTester.module.css' // Подключаем стили

const MailTester = () => {
  const handleClick = () => {
    window.open('https://www.mail-tester.com/', '_blank')
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Проверка письма на спам</h1>
      <button onClick={handleClick} className={styles.button}>
        Перейти на Mail-Tester
      </button>
    </div>
  )
}

export default MailTester
