import gotScraping from 'got-scraping';
import cheerio from 'cheerio';
let data = [];

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

console.log(data[3]);
}

getGasPrices();