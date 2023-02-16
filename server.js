import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import gotScraping from 'got-scraping';
import cheerio from 'cheerio';
import { request } from "https";
let data = ['$-.--','$-.--','$-.--','$-.--',];


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/getPrices', (request, response) => {
  let data = getPrices();
  response.status(200).json(data);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

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