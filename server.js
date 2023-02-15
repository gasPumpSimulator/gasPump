import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/getPrices', (request, response) => {
  response.status(200).json({info: '3.50'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

