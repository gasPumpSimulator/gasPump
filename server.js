import express, { json } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import gotScraping from 'got-scraping';
import cheerio from 'cheerio';
import { getTransactions, getTransaction, createTransaction, checkUsernamePassword, checkCreditCard, addUser} from './database.js';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

let returnValue = ['$-.--', '$-.--','$-.--','$-.--'];
let data = [];
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//for login session
app.use(session({
  secret: 'secret',
  resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'))
})
app.get('/adminLogin', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/login.html'))
})
app.get('/register', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/register.html'))
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


app.get('/transactions/:id', async (req, res) => {
  const id = req.params.id;
  const transaction = await getTransaction(id);
  res.send(transaction);
})

app.post('/transactions', async (req, res) => {
  const { paymentMethod, gasType, pricePerGallon, gallonsPurchased, totalPrice, creditCardName } = req.body;
  const transaction = await createTransaction(paymentMethod, gasType, pricePerGallon, gallonsPurchased, totalPrice, creditCardName);
  res.send(transaction);
})
app.post('/addUser', async (request, response) => {
  let username = request.body.username;
  let password = request.body.username;
  let adminPassword = request. body.adminPassword;

  if(adminPassword == process.env.ADMIN_PASSWORD) {
    const result = await addUser(username, password);
    if(result === false) {
      response.send('User already exists');
      console.log("success")
    }
    response.sendFile(path.join(__dirname, 'public/mainMenu.html'))
    console.log(result)
  }
})

app.post('/login', async (request, response) => {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
      const results = await checkUsernamePassword(username, password);
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/mainMenu');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/mainMenu', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/mainMenu.html'))
})

app.listen(process.env.PORT_NUMBER, () => {
  console.log(`Example app listening on port ${process.env.PORT_NUMBER}`)
})

app.post('/creditNumCheck', async (request, response) => {
  const creditNum = request.body.creditNumber;
  console.log(creditNum);
  const results = await checkCreditCard(creditNum);
  response.send(results);
})

//database 
app.get('/getTransactions', async (req, res) => {
  const transactions = await getTransactions();
  res.send(transactions);
})

