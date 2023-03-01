import express, { json } from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import gotScraping from 'got-scraping';
import cheerio from 'cheerio';
import { getTransactions, getTransaction, createTransaction } from './database.js';
let returnValue = ['$-.--', '$-.--','$-.--','$-.--'];
let data = [];
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/getPrices', async (request, response) => {

    const storeUrl = 'https://gasprices.aaa.com/?state=IN';
    // Download HTML with Got Scraping
    const res = await gotScraping.gotScraping(storeUrl);
    const html = res.body;
    // Parse HTML with Cheerio
    const $ = cheerio.load(html);
    //get all the tr elements on page add to array
    $('.table-mob:first tr').each((_, e) => {
    
        let row  = $(e).text().replace(/(\s+)/g, ' ');
        data.push(row);  
    });
    //add all elements that have price in them to return arrray
    returnValue[0] = data[1].split(' ')[3];
    returnValue[1] = data[1].split(' ')[4];
    returnValue[2] = data[1].split(' ')[5];
    returnValue[3] = data[1].split(' ')[6];
    //return value to frontend
    response.status(200).json(returnValue);
})

//database 
app.get('/transactions', async (req, res) => {
  const transactions = await getTransactions();
  res.send(transactions);
})

app.get('/transactions/:id', async (req, res) => {
  const id = req.params.id;
  const transaction = await getTransaction(id);
  res.send(transaction);
})

app.post('/transactions', async (req, res) => {
  const { gallons, price } = req.body;
  const transaction = await createTransaction(gallons, price);
  res.send(transaction);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


