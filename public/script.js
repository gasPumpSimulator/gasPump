/* eslint-disable no-unused-vars */
let chosenGasBool = false;
let emergencyStop = false;
let receiptBool = false;

//html fields
let outputField = document.getElementById("interface");
let gallonDisplayField = document.getElementById("gallonDisplay");
let gallonsInput = document.getElementById("gallons");
let inputField = document.getElementById("input");
inputField.setAttribute("type", "hidden");
let beginFuelingButton = document.getElementById("beginFueling");
let emergencyShutoff = document.getElementById("emergencyShutoff");
const receiptInfo = document.getElementById("receiptInfo");
const receiptContainer = document.getElementById("receiptContainer");
const receiptInputDiv = document.getElementById("receiptInputDiv");

//object to hold transaction information
let transactionObject = {
  chosenGasNumber: "",
  chosenGasPrice: "",
  paymentMethod: "",
  cashAmount: "",
  gasTankSize: "",
  costOfGas: "",
  creditCardNumber: "",
  creditCardName: "cash(none)",
  creditCardType: "",
  cvcCode: "",
  creditExp: "",
};

//input variables and step in process
let currentInput = "";
let stepInPumpProcess = 1;

//port number definition
let port = "localhost:3000";

// variables for interval timer
let gallonsPumped = 0;
let intervalId;
let timeoutID;

//disable unused buttons
document.getElementById("D").disabled = true;
document.getElementById("no").disabled = true;
document.getElementById("yes").disabled = true;

//disable beginFueling button
beginFuelingButton.disabled = true;
emergencyShutoff.disabled = true;
//1st step in process, determines the payment type: cash or credit
function paymentMethodFunction(input = 0) {
  console.log("Step 1");
  let message = "Press 1 for credit or 2 for cash then ENTER";
  inputField.setAttribute("type", "hidden");
  if (input === 1) {
    inputField.setAttribute("type", "text");
    message = "Input name on credit card and press ENTER";
    transactionObject.paymentMethod = "card";
    stepInPumpProcess++;
  } else if (input === 2) {
    inputField.setAttribute("type", "text");
    message = "Input cash amount and press ENTER";
    transactionObject.paymentMethod = "cash";
    stepInPumpProcess++;
  }
  currentInput = "";
  outputField.innerHTML = message;
  console.log("End of step 1");
}

//2nd step in process, checks credit name or amount of gas using cash, skips credit steps if cash
/*
The regex pattern used here allows for:
First name: One or more letters (uppercase or lowercase).
Middle initial or name: An optional middle initial or name, followed by an optional hyphen and one or more letters (uppercase or lowercase).
Last name: One or more letters (uppercase or lowercase).
Examples of valid names: 
John Smith
Jane D. Doe
Bob O'Connor
Mary-Ann Johnson
Sarah S. Johnson-Smith
Date last updated: 4/17/23
*/
function checkCreditNameOrCash() {
  console.log("Step 2");
  inputField.setAttribute("type", "text");
  let regexName =
    /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*(?:[\s]+[a-zA-Z]+(?:[\s-][a-zA-Z]+)*)*$/;
  if (currentInput === "") {
    return;
  }
  if (transactionObject.paymentMethod === "card") {
    outputField.innerHTML = "Enter credit card number then press enter";
    if (regexName.test(currentInput)) {
      transactionObject.creditCardName = currentInput;
      stepInPumpProcess++;
    } else {
      outputField.innerHTML = "Invalid name, please try again";
      return;
    }
  } else {
    if (typeof +inputField.value === "number" && !isNaN(+inputField.value)) {
      transactionObject.cashAmount = currentInput;
      stepInPumpProcess = 7;
    }
  }
  inputField.value = "";
  currentInput = "";
  console.log("End of step 2");
}
//3rd step, checks inputted name
async function checkNumCredit() {
  console.log("Step 3");
  if (!cardNum(currentInput)) {
    outputField.innerHTML = "Invalid credit card number, please try again";
  } else {
    outputField.innerHTML = "Enter CVC code then press enter";
    transactionObject.creditCardNumber = currentInput;
    stepInPumpProcess++;
  }
  inputField.value = "";
  currentInput == "";
  console.log("End of step 3");
}
//4th step in process checks CVC
function checkCreditCVC() {
  console.log("Step 4");
  if (currentInput === "") {
    return;
  }
  if (!cardCVC(transactionObject.creditCardType)) {
    outputField.innerHTML = "Invalid CVC, please Try again";
  } else {
    transactionObject.cvcCode = currentInput;
    outputField.innerHTML =
      "Please enter credit card expiration date in the form MM.YYYY then press ENTER";
    stepInPumpProcess++;
  }
  currentInput = "";
  inputField.value = "";
  console.log("End of step 4");
}

//5th step checks expiration date
//Updated regex to support the format MM.YYYY (e.g. 01.2012, 10.2024)
function checkCreditExp() {
  console.log("Step 5");
  if (currentInput === "") {
    return;
  }
  if (!cardExp()) {
    outputField.innerHTML = "Invalid Expiration date. Please Try again";
  } else {
    transactionObject.creditExp = currentInput;
    outputField.innerHTML = "";
    stepInPumpProcess++;
    outputField.innerHTML =
      "Press enter to validate credit card information server-side. . .";
    inputField.setAttribute("type", "hidden");
  }
  currentInput = "";
  inputField.value = "";
  console.log("End of step 5");
}

//6th step validates credit card format on server; should return true or false
async function validateCardServer() {
  console.log("Step 6");
  try {
    const response = await fetch(`http://${port}/cardCheck`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creditCardName: transactionObject.creditCardName,
        creditCardNumber: transactionObject.creditCardNumber,
        creditCardType: transactionObject.creditCardType,
        cvcCode: transactionObject.cvcCode,
        creditExp: transactionObject.creditExp,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send credit card info");
    }

    //Catch response binary value from server
    const binaryValue = await response.text();
    if (binaryValue === "1") {
      console.log(
        "According to the server, the credit card information is valid."
      );
      outputField.innerHTML = "Response: Valid.\n Press enter again.";
      stepInPumpProcess++; //Next step
    } else if (binaryValue === "0") {
      console.log(
        "According to the server, the credit card information is invalid."
      );
      outputField.innerHTML = "Response: Invalid.\n Press enter again.";
      transactionObject.paymentMethod = "";
      transactionObject.creditCardNumber = "";
      transactionObject.creditCardName = "cash(none)";
      transactionObject.creditCardType = "";
      transactionObject.cvcCode = "";
      transactionObject.creditExp = "";
      stepInPumpProcess = 1; //Returns to first step; restarts process of inputting credit card information.
    }
  } catch (error) {
    console.error("Error sending credit card info: ", error);
    //handle the error here
  }
  currentInput = "";
  console.log("End of step 6");
}

//7th step in the process where the size of the gas tank is inputted
function tankSize() {
  console.log("Step 7");
  if (isNaN(currentInput) && (currentInput <= 0 || currentInput === "")) {
    console.log("Invalid tank size.");
    return;
  }
  if (transactionObject.paymentMethod === "card") {
    outputField.innerHTML = "Enter size of fuel tank and press enter";
    inputField.setAttribute("type", "text");
  } else {
    inputField.setAttribute("type", "hidden");
    outputField.innerHTML = "Press the fuel type you want and press ENTER";
  }
  stepInPumpProcess++;
  transactionObject.gasTankSize = currentInput;
  currentInput = "";
  inputField.value = "";
  console.log("End of step 7");
}

//change color of button for chosen gas type
function changeColor(input, inputedPrice) {
  let price = document.getElementById(inputedPrice).innerHTML;
  price = price.replace("$", "");
  let ChosenButton = document.getElementById(input);
  if (
    !chosenGasBool &&
    (transactionObject.gasTankSize != 0 || transactionObject.cashAmount != 0)
  ) {
    ChosenButton.style.backgroundColor = "red";
    chosenGasBool = true;
    transactionObject.chosenGasNumber = input;
    transactionObject.chosenGasPrice = price;
  }
}

//8th step computes amount of gas to be pumped
function amountOfGasPumped() {
  console.log("Step 8");
  if (!chosenGasBool) {
    return;
  }

  if (transactionObject.paymentMethod === "cash") {
    let amountOfGas =
      transactionObject.cashAmount / transactionObject.chosenGasPrice;
    transactionObject.gasTankSize = amountOfGas;
    transactionObject.costOfGas = transactionObject.cashAmount;
    outputField.innerHTML =
      Math.round(amountOfGas * 100) / 100 +
      " gallons purchased press BEGIN FUELING";
  } else if (transactionObject.paymentMethod === "card") {
    transactionObject.costOfGas =
      transactionObject.gasTankSize * transactionObject.chosenGasPrice;
    outputField.innerHTML =
      "$" +
      Math.round(transactionObject.costOfGas * 100) / 100 +
      " of gas purchased press 'BEGIN FUELING'";
  }
  stepInPumpProcess++;
  beginFuelingButton.disabled = false;
  emergencyShutoff.disabled = false;
  console.log("End of step 8");
}

//add input to current input
function addToInput(input) {
  if (stepInPumpProcess > 1) {
    currentInput = inputField.value + input;
    inputField.value = currentInput;
  }
}

//switch statement for process
function compute(input) {
  if ((input === 1 || input === 2) && stepInPumpProcess > 1) {
    return;
  }
  currentInput = inputField.value;
  switch (stepInPumpProcess) {
    case 1:
      paymentMethodFunction(input);
      break;
    case 2:
      checkCreditNameOrCash();
      break;
    case 3:
      checkNumCredit();
      break;
    case 4:
      checkCreditCVC();
      break;
    case 5:
      checkCreditExp();
      break;
    case 6:
      validateCardServer();
      break;
    case 7:
      tankSize();
      break;
    case 8:
      amountOfGasPumped();
      break;
    case 9:
      displayReceipt();
  }
}

//show gallons as they are being pumped
function showGallons() {
  //send post request of gallons and price
  //postTransaction(gasTankSize, price);
  if (emergencyStop === true) {
    return;
  }
  inputField.innerHTML = "NOW FUELING";
  gallonDisplayField.innerHTML = "Gallons Pumped:  ";
  intervalId = setInterval(incrementGallons, 10);
}

//increment gallons
function incrementGallons() {
  gallonsPumped += 0.01;
  gallonsPumped = Math.round(gallonsPumped * 100) / 100;
  if (
    gallonsPumped === Math.round(transactionObject.gasTankSize * 100) / 100 ||
    emergencyStop === true
  ) {
    gallonsInput.innerHTML = " " + gallonsPumped;
    if (emergencyStop === true) {
      outputField.innerHTML = "Emergency stop initiated";
    } else {
      outputField.innerHTML = "Done Fueling";
    }
    postTransaction(transactionObject);
    clearInterval(intervalId);
    timeoutID = setTimeout(askReceipt, 3000);
  } else {
    gallonsInput.innerHTML = " " + gallonsPumped;
  }
}

// email
function askReceipt() {
  clearTimeout(timeoutID);
  outputField.innerHTML =
    "Would you like a receipt? Press ENTER for YES, RESET for NO";
  gallonDisplayField.innerHTML = " ";
  gallonsInput.innerHTML = " ";
  receiptBool = true;
}

function displayReceipt() {
  receiptInfo.innerHTML = `Thank you for your purshase! 
  Enter email address for printed receipt:`;

  let emailInputBox = document.createElement("input");
  emailInputBox.setAttribute("type", "text");
  emailInputBox.setAttribute("id", "emailInput");

  let emailSubmitButton = document.createElement("button");
  emailSubmitButton.innerHTML = "SEND";
  emailSubmitButton.setAttribute("id", "emailSubmit");
  emailSubmitButton.setAttribute("onClick", "sendEmail()");
  emailSubmitButton.setAttribute("action", "/mail");
  emailSubmitButton.setAttribute("method", "POST");

  receiptInputDiv.appendChild(emailInputBox);
  receiptInputDiv.appendChild(emailSubmitButton);
}

async function sendEmail() {
  receiptInfo.innerHTML = "";

  let email = emailInput.value;
  console.log(email);
  fetch(`http://${port}/mail`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      gallons: gallonsPumped,
      cost: transactionObject.costOfGas,
    }),
  })
    .then((response) => response.json())
    .then((response) => console.log(JSON.stringify(response)))
    .then(alert("Email sent!"));
}

//emergency shutoff
function stopFueling() {
  emergencyStop = true;
}

//frontend for getting data for gas prices API
let gasPrice87 = document.getElementById("price87");
let gasPrice89 = document.getElementById("price89");
let gasPrice93 = document.getElementById("price93");
let gasPriceDiesel = document.getElementById("priceDiesel");
let periodBtn = document.getElementById("period");

const baseUrl = `http://${port}/getPrices`;

async function getPrices() {
  const response = await fetch(baseUrl, {
    method: "GET",
  });
  const data = await response.json();
  gasPrice87.innerHTML = data[0];
  gasPrice89.innerHTML = data[1];
  gasPrice93.innerHTML = data[2];
  gasPriceDiesel.innerHTML = data[3];
}

//reset everything for new transaction
function reset() {
  if (emergencyStop || inputField.innerHTML === "Done Fueling" || receiptBool) {
    currentInput = "";
    stepInPumpProcess = 1;
    gallonsPumped = 0;
    chosenGasBool = false;
    emergencyStop = false;
    document.getElementById(
      transactionObject.chosenGasNumber
    ).style.backgroundColor = "white";
    for (let key in transactionObject) {
      transactionObject.key = "";
    }
    transactionObject.creditCardName = "cash(none)";
    outputField.innerHTML = "Enter 1 for credit or 2 for cash";
    inputField.value = "";
    inputField.type = "hidden";
    gallonsInput.innerHTML = "";
    gallonDisplayField.innerHTML = "";
    beginFuelingButton.disabled = true;
    emergencyShutoff.disabled = true;
  } else if (!emergencyShutoff.disabled) {
    return;
  }
}
// add transaction to db
async function postTransaction(transactionObject) {
  fetch(`http://${port}/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentMethod: transactionObject.paymentMethod,
      gasType: transactionObject.chosenGasNumber,
      pricePerGallon: transactionObject.chosenGasPrice,
      gallonsPurchased: transactionObject.gasTankSize,
      totalPrice: transactionObject.costOfGas,
      creditCardName: transactionObject.creditCardName,
      creditCardNumber: transactionObject.creditCardNumber,
      creditCardType: transactionObject.creditCardType,
      creditExp: transactionObject.creditExp,
    }),
  })
    .then((response) => response.json())
    .then((response) => console.log(JSON.stringify(response)));
}

async function databaseCreditNumCheck(transactionObject) {
  const response = await fetch(`http://${port}/creditNumCheck`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      creditNumber: transactionObject.creditCardNumber,
    }),
  });
  const data = await response.json();
  if (data.length < 1) {
    return false;
  } else {
    transactionObject.creditCardName = data[0].name;
    return true;
  }
}

//Frontend credit card formatting and validation START
/*
Checks for credit card validation through the use of the Luhn algorithm.
It's an error-checking algorithm supported by all major credit card networks used 
to verify each card numbers' length and validity. This is checked using multiple RegEx patterns.
Supports American Express (Amex/AmEx), Visa, Mastercard, Discover, Diners club, and JCB.
Regex prevents anything outside of numbers.
Last updated: 3/27/23
*/
function cardNum(inputCardNo) {
  let cardno;
  let cardNoValid = false;
  //Validate card numbers' length and pattern using regex
  for (let i = 0; i < 6; ++i) {
    switch (i) {
      case 0: //American Express (Amex/AmEx)
        cardno = /^(?:3[47][0-9]{13})$/;
        if (inputCardNo.match(cardno)) {
          cardNoValid = true;
          transactionObject.creditCardType = "Amex";
        }
        break;
      case 1: //Visa
        cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        if (inputCardNo.match(cardno)) {
          cardNoValid = true;
          transactionObject.creditCardType = "Visa";
        }
        break;
      case 2: //Mastercard
        cardno = /^(?:5[1-5][0-9]{14})$/;
        if (inputCardNo.match(cardno)) {
          cardNoValid = true;
          transactionObject.creditCardType = "Mastercard";
        }
        break;
      case 3: //Discover
        cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        if (inputCardNo.match(cardno)) {
          cardNoValid = true;
          transactionObject.creditCardType = "Discover";
        }
        break;
      case 4: //Diners club
        cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
        if (inputCardNo.match(cardno)) {
          cardNoValid = true;
          transactionObject.creditCardType = "Discover";
        }
        break;
      case 5: //JCB
        cardno = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
        if (inputCardNo.match(cardno)) {
          cardNoValid = true;
          transactionObject.creditCardType = "Amex/Discover";
        }
        break;
    }
  }
  console.log(
    "End of cardNum function \nReturn type: " +
      cardNoValid +
      "\nCard type: " +
      transactionObject.creditCardType
  );
  return cardNoValid;
}

//Validates credit expiration in the format MM.YYYY
//Date last updated 4/16/23
function cardExp() {
  // Get current date and format it to MM.YYYY
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns zero-indexed month
  const currentYear = currentDate.getFullYear();
  const cardMonth = parseInt(currentInput.slice(0, 2));
  const cardYear = parseInt(currentInput.slice(3));
  let expValid = false;
  let regExp = /^(0[1-9]|1[0-2])\.\d{4}$/;

  if (cardYear > currentYear) {
    expValid = true;
  } else if (cardYear == currentYear) {
    if (cardMonth > currentMonth) {
      expValid = true;
    }
  }
  console.log(
    "End of cardExp function " +
      "| Return type: " +
      (regExp.test(currentInput) && expValid)
  );

  return regExp.test(currentInput) && expValid;
}

//Validates credit CVC based on major credit card network determined by cardNum() function; also prevents anything that isn't a number
function cardCVC(_creditCardName) {
  let valid = false;
  switch (_creditCardName) {
    case "Amex":
      if (currentInput.length == 4 && !isNaN(currentInput)) valid = true;
      break;
    case "Visa":
      if (currentInput.length == 3 && !isNaN(currentInput)) valid = true;
      break;
    case "Mastercard":
      if (currentInput.length == 3 && !isNaN(currentInput)) valid = true;
      break;
    case "Discover":
      if (currentInput.length == 3 && !isNaN(currentInput)) valid = true;
      break;
    case "Amex/Discover":
      if (
        (currentInput.length == 3 || currentInput.length == 4) &&
        !currentInput.isNaN()
      )
        valid = true;
      break;
  }
  console.log("End of cardCVC function | Return type: " + valid);
  return valid;
}

//Frontend credit card formatting and validation END
