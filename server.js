// eslint-disable-next-line no-unused-vars
import express, { json } from "express";
import path from "path";
import { fileURLToPath } from "url";
import gotScraping from "got-scraping";
import cheerio from "cheerio";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { cardNum, cardExp, cardCVC } from "./Server_parts/creditCardValid.js"; //Credit card validation functions

import {
  getTransactions,
  getTransaction,
  createTransaction,
  checkUsernamePassword,
  checkCreditCard,
  addUser,
} from "./database.js";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

let returnValue = ["$-.--", "$-.--", "$-.--", "$-.--"];
let data = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//for login session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/adminLogin", (request, response) => {
  response.sendFile(path.join(__dirname, "public/login.html"));
});
app.get("/register", (request, response) => {
  response.sendFile(path.join(__dirname, "public/register.html"));
});
app.get("/getPrices", async (request, response) => {
  const storeUrl = "https://gasprices.aaa.com/?state=IN";
  // Download HTML with Got Scraping
  const res = await gotScraping.gotScraping(storeUrl);
  const html = res.body;
  // Parse HTML with Cheerio
  const $ = cheerio.load(html);
  //get all the tr elements on page add to array
  $(".table-mob:first tr").each((_, e) => {
    let row = $(e).text().replace(/(\s+)/g, " ");
    data.push(row);
  });
  //add all elements that have price in them to return arrray
  returnValue[0] = data[1].split(" ")[3];
  returnValue[1] = data[1].split(" ")[4];
  returnValue[2] = data[1].split(" ")[5];
  returnValue[3] = data[1].split(" ")[6];
  //return value to frontend
  response.status(200).json(returnValue);
});

app.get("/transactions/:id", async (req, res) => {
  const id = req.params.id;
  const transaction = await getTransaction(id);
  res.send(transaction);
});

app.post("/transactions", async (req, res) => {
  const {
    paymentMethod,
    gasType,
    pricePerGallon,
    gallonsPurchased,
    totalPrice,
    creditCardName,
  } = req.body;
  const transaction = await createTransaction(
    paymentMethod,
    gasType,
    pricePerGallon,
    gallonsPurchased,
    totalPrice,
    creditCardName
  );
  res.send(transaction);
});
app.post("/addUser", async (request, response) => {
  const username = request.body.username;
  const salt = bcrypt.genSaltSync(10);
  const password = await bcrypt.hash(request.body.password, salt);
  let adminPassword = request.body.adminPassword;

  if (adminPassword == process.env.ADMIN_PASSWORD) {
    const result = await addUser(username, password, salt);
    if (result === false) {
      response.send("User already exists");
    } else {
      request.session.loggedin = true;
      request.session.username = username;
      response.sendFile(path.join(__dirname, "public/mainMenu.html"));
    }
  }
});

app.post("/login", async (request, response) => {
  // Capture the input fields
  const username = request.body.username;
  const password = request.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // use async functions to check password, hash and compare them
    (async function () {
      try {
        const results = await checkUsernamePassword(username);
        const saltedPassword = await bcrypt.hash(password, results[0].salt);
        await passwordValidityCheck(results[0].password, saltedPassword);
      } catch (e) {
        console.log(e);
      }
    })();
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
  async function passwordValidityCheck(inputedPassword, DatabasePassword) {
    if (DatabasePassword.length > 0 && DatabasePassword === inputedPassword) {
      // Authenticate the user
      request.session.loggedin = true;
      request.session.username = username;
      // Redirect to home page
      response.redirect("/mainMenu");
    } else {
      response.send("Incorrect Username and/or Password!");
      response.end();
    }
  }
});

app.get("/mainMenu", (request, response) => {
  if (request.session.loggedin === true) {
    response.sendFile(path.join(__dirname, "public/mainMenu.html"));
  } else {
    response.send("Must log in!");
  }
});
app.get("/logOut", (request, response) => {
  request.session.loggedin = false;
  response.sendFile(path.join(__dirname, "public/index.html"));
});
app.listen(process.env.PORT_NUMBER, () => {
  console.log(`Example app listening on port ${process.env.PORT_NUMBER}`);
});

app.post("/creditNumCheck", async (request, response) => {
  const creditNum = request.body.creditNumber;
  const results = await checkCreditCard(creditNum);
  response.send(results);
});

//database
app.get("/getTransactions", async (req, res) => {
  const transactions = await getTransactions();
  res.send(transactions);
});

// emailed receipt
app.post("/mail", async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "gaspumpivytech@outlook.com",
      pass: "g@spump!23",
    },
  });

  const mailOptions = {
    from: "gaspumpivytech@outlook.com",
    to: req.body.email,
    subject: "Gas Receipt",
    text: `Thank you for your purchase! Total Cost: $${req.body.cost} || Gallons Pumped: ${req.body.gallons}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

//Validates credit card information and sends 1 or 0 depending if the credit card information
app.post("/cardCheck", async (req, res) => {
  const {
    creditCardName,
    creditCardNumber,
    creditCardType,
    cvcCode,
    creditExp,
  } = req.body;
  console.log("Incoming payment request: ", req.body);

  //Validate credit card number, cvc, and expiration date
  const cardNumValid = cardNum(creditCardNumber);
  const cardCVCValid = cardCVC(cvcCode, creditCardType);
  const cardExpValid = cardExp(creditExp);

  //Send binary value back to validateCardServer() frontend async function
  if (cardNumValid && cardCVCValid && cardExpValid) {
    console.log("Response: True");
    res.send("1");
  } else {
    console.log("Response: False");
    res.send("0");
  }
});

//Code to connect to oracle database
/*
app.post('/searchTransactions', async (req, res) => {
  const ID = req.body.searchByID;
  const name = req.body.name;
  const paymentMethod = req.body.paymentMethod;
  const gasType = req.body.gasType;
  const pricePerGallon = req.body.pricePerGallon;

  const maxPricePerGallon = req.body.maxPricePerGallon;
  const minPricePerGallon = req.body.minPricePerGallon;

  const gallonsPurchased = req.body.GallonsPurchased;

  const minGallonsPurchased = req.body.minGallonsPurchased;
  const maxGallonsPurchased = req.body.maxGallonsPurchased;
  const totalCost = req.body.totalCost;

  const maxTotalCost = req.body.maxTotalCost;
  const minTotalCost = req.body.minTotalCost;

  const minTime = req.body.startTime;
  const maxTime = req.body.endTime;


  console.log({
    ID,
    name,
    paymentMethod,
    gasType,
    pricePerGallon,
    maxPricePerGallon,
    minPricePerGallon,
    gallonsPurchased,
    minGallonsPurchased,
    maxGallonsPurchased,
    totalCost,
    maxTotalCost,
    minTotalCost,
    minTime,
    maxTime,
  });
  console.log(results);
  res.sendFile(path.join(__dirname, 'public/mainMenu.html'));
})

    async function passwordValidityCheck(inputedPassword, DatabasePassword) {
      if (DatabasePassword.length > 0 && DatabasePassword === inputedPassword) {
        // Authenticate the user
        request.session.loggedin = true;
        request.session.username = username;
        // Redirect to home page
        response.redirect("/mainMenu");
      } else {
        response.send("Incorrect Username and/or Password!");
        response.end();
      }
    }
*/
