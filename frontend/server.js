import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import compression from 'compression'

const app = express()
const PORT = process.env.PORT || 3000

// Для корректного получения пути к текущей директории в ES-модулях
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Включаем сжатие для всех ответов
app.use(compression())

// Настроим кэширование в зависимости от среды
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Cache-Control', 'public, max-age=31536000') // 1 год для продакшн
  } else {
    res.setHeader('Cache-Control', 'no-cache') // Для дев-сборки отключаем кэширование
  }
  next()
})

// Указываем папку с продакшн-сборкой
app.use(express.static(path.join(__dirname, 'dist')))

// Все запросы, не попадающие на файлы, перенаправляем на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
