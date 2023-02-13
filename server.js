import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 9000

app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'htmlCss/index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})