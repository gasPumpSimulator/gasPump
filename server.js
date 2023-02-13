const express = require('express')
const path = require('path')
const app = express()
const port = 9000
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'htmlCss/index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})