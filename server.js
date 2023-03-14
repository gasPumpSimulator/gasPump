import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import gotScraping from 'got-scraping';
import cheerio from 'cheerio';
<<<<<<< HEAD
let returnValue = ['$-.--', '$-.--','$-.--','$-.--'];
let data = [];
=======
<<<<<<< HEAD
import { request } from "https";
let data = ['$-.--','$-.--','$-.--','$-.--',];

=======
let returnValue = ['$-.--', '$-.--','$-.--','$-.--'];
let data = [];
>>>>>>> main
>>>>>>> c984a8aabbd591308253c55a6ac1937236598bad

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'))
})
<<<<<<< HEAD

=======
<<<<<<< HEAD
app.get('/adminLogin', (request, response) => {
  response. sendFile(path.join(__dirname, 'public/login.html'))
})
=======

>>>>>>> main
>>>>>>> c984a8aabbd591308253c55a6ac1937236598bad
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


<<<<<<< HEAD
=======
<<<<<<< HEAD

//function for getting gas
function getPrices() {
var options = {
  "method": "GET",
  "hostname": "api.collectapi.com",
  "port": null,
  "path": "/gasPrice/stateUsaPrice?state=IN",
  "headers": {
  "content-type": "application/json",
  "authorization": "apikey 3fXNLjSzicFt8OTb6aTUHp:6Q8v4FvJ4afKvmiD7esJD3"
  }
  };

var req = request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    let jsonData = JSON.parse(body.toString());
  data[0] = '$' + jsonData.result.state.gasoline;
  data[1] = '$' + jsonData.result.state.midGrade;
  data[2] = '$' + jsonData.result.state.premium;
  data[3] = '$' + jsonData.result.state.diesel;
  });
});
req.end();
return data;
}
=======
>>>>>>> main
>>>>>>> c984a8aabbd591308253c55a6ac1937236598bad
