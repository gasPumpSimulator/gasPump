import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import gotScraping from 'got-scraping';
import cheerio from 'cheerio';
let data = [];


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/getPrices', (request, response) => {

  async function getGasPrices() {
      const storeUrl = 'https://api.apify.com/v2/datasets/oRfOLi79S4TcYn7V7/items?token=apify_api_DVgZweSpe7Lp9jEr9AQht1ERabqQER1sxBgR';
      // Download HTML with Got Scraping
      const response = await gotScraping.gotScraping(storeUrl);
      const html = response.body;
      // Parse HTML with Cheerio
      const $ = cheerio.load(html);
      const headingElement = $('gasPrices');
      const headingText = headingElement.text();
      const jsonFile = JSON.parse(html);
      let dataSet = jsonFile[9];
      // Print page title to terminal
      data[0] = dataSet.gasPrices[0].priceTag;
      data[1] = dataSet.gasPrices[1].priceTag;
      data[2] = dataSet.gasPrices[2].priceTag;
      data[3] = dataSet.gasPrices[3].priceTag;
    }
    getGasPrices();
    response.status(200).json(data);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

