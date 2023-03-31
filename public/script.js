/* eslint-disable no-unused-vars */
let chosenGasBool = false;
let emergencyStop = false;
let receiptBool = false;

//html fields
let outputField = document.getElementById("interface");
let gallonDisplayField = document.getElementById("gallonDisplay");
let gallonsInput = document.getElementById("gallons");
let inputField = document.getElementById("input");
let beginFuelingButton = document.getElementById("beginFueling");
let emergencyShutoff = document.getElementById("emergencyShutoff");

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

//determine payment type, 1st step in process
function paymentMethodFunction(input) {
  let message;
  if (input === 1) {
    message = "input name on credit card and press ENTER";
    transactionObject.paymentMethod = "card";
  } else {
    message = "input cash amount and press ENTER";
    transactionObject.paymentMethod = "cash";
  }
  outputField.innerHTML = message;
  stepInPumpProcess++;
}
//2nd step in process, checks credit name or amount of gas using cash, skips credit steps if cash
async function checkCreditNameOrCash() {
  if (currentInput === "") {
    return;
  }
  if (transactionObject.paymentMethod === "card") {
    transactionObject.creditCardName = currentInput;
    outputField.innerHTML = "Enter credit card number then press enter";
    stepInPumpProcess++;
  } else {
    transactionObject.cashAmount = currentInput;
    outputField.innerHTML = `$${transactionObject.cashAmount} of gas purchased, choose gas type then press enter`;
    stepInPumpProcess = 7;
  }
  inputField.value = "";
  currentInput = "";
}
//3rd step, checks inputted name
/*async*/ function checkNumCredit() {
  if (
    currentInput.length > 4 /*||
    (
      /*await databaseCreditNumCheck(currentInput)) == false*/
  ) {
    outputField.innerHTML = "Invalid Entry. Please try again";
  } else {
    outputField.innerHTML = "Enter the 3 digit CVC code then press enter";
    stepInPumpProcess++;
  }
  inputField.value = "";
  currentInput == "";
}
//4th step in process checks CVC
function checkCreditCVC() {
  if (currentInput === "") {
    return;
  }
  if (currentInput.length > 3) {
    outputField.innerHTML = "Invalid CVC.  Please Try again";
  } else {
    transactionObject.cvcCode = currentInput;
    outputField.innerHTML =
      "Please enter credit card expiration date then press ENTER";
    stepInPumpProcess++;
  }
  currentInput = "";
  inputField.value = "";
}
//5th step checks expiration date
function checkCreditExp() {
  if (currentInput === "") {
    return;
  }
  if (currentInput.length > 3) {
    outputField.innerHTML = "Invalid Expiration date. Please Try again";
  } else {
    transactionObject.creditExp = currentInput;
    outputField.innerHTML = "";
    stepInPumpProcess++;
    outputField.innerHTML = "Enter size of gas tank and press enter";
  }
  currentInput = "";
  inputField.value = "";
}
//6th step in process
function tankSize() {
  if (currentInput <= 0 || currentInput === "") {
    return;
  }
  stepInPumpProcess++;
  transactionObject.gasTankSize = currentInput;
  outputField.innerHTML = "Choose type of gas and press enter";
  currentInput = "";
  inputField.value = "";
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

//compute amount of gas to be pumped 7th step
function amountOfGasPumped() {
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
      " of gas purchased press BEGIN FUELING";
  }
  stepInPumpProcess++;
  beginFuelingButton.disabled = false;
  emergencyShutoff.disabled = false;
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
      tankSize();
      break;
    case 7:
      amountOfGasPumped();
      break;
    case 8:
      displayreceipt();
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
      inputField.type = "hidden";
    }
    postTransaction(transactionObject);
    clearInterval(intervalId);
    timeoutID = setTimeout(askReceipt, 3000);
  } else {
    gallonsInput.innerHTML = " " + gallonsPumped;
  }
}

function askReceipt() {
  clearTimeout(timeoutID);
  outputField.innerHTML =
    "Would you like a receipt? Press ENTER for YES, RESET for NO";
  gallonDisplayField.innerHTML = "";
  gallonsInput.innerHTML = "";
  receiptBool = true;
}

function displayreceipt() {
  alert(
    `Thank you for your purchase! Gallons pumped: ${gallonsPumped} || Price: ${transactionObject.costOfGas} || Enter email address for printed receipt`
  );
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
    inputField.type = "visible";
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
function cardNum() {
  let cardno;
  let cardNoValid = false;
  //Validate card numbers' length and pattern using regex
  for (let i = 0; i < 6; ++i) {
    switch (i) {
      case 0: //American Express (Amex/AmEx)
        cardno = /^(?:3[47][0-9]{13})$/;
        if (currentInputNumber.value.match(cardno)) {
          cardNoValid = true;
          creditCardName = "Amex";
        }
        break;
      case 1: //Visa
        cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        if (currentInputNumber.value.match(cardno)) {
          cardNoValid = true;
          creditCardName = "Visa";
        }
        break;
      case 2: //Mastercard
        cardno = /^(?:5[1-5][0-9]{14})$/;
        if (currentInputNumber.value.match(cardno)) {
          cardNoValid = true;
          creditCardName = "Mastercard";
        }
        break;
      case 3: //Discover
        cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        if (currentInputNumber.value.match(cardno)) {
          cardNoValid = true;
          creditCardName = "Discover";
        }
        break;
      case 4: //Diners club
        cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
        if (currentInputNumber.value.match(cardno)) {
          cardNoValid = true;
          creditCardName = "Discover";
        }
        break;
      case 5: //JCB
        cardno = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
        if (currentInputNumber.value.match(cardno)) {
          cardNoValid = true;
          creditCardName = "Amex/Discover";
        }
        break;
    }
  }
  console.log(
    "End of cardNum function \nReturn type: " +
      cardNoValid +
      "\nCard type: " +
      creditCardName
  );
  return cardNoValid;
}

function cardExpMonth() {
  let monthValid = false;

  console.log("End of cardExp function | Return type: " + monthValid);
  return monthValid;
}

function cardExpYear() {
  let yearValid = false;

  console.log("End of cardExp function | Return type: " + yearValid);
  return yearValid;
}

function cardCVC(_creditCardName) {
  let valid = false;
  switch (_creditCardName) {
    case "Amex":
      if (creditCardCVC.length() == 4 && !creditCardCVC.isNaN()) valid = true;
      break;
    case "Visa":
      if (creditCardCVC.length() == 3 && !creditCardCVC.isNaN()) valid = true;
      break;
    case "Mastercard":
      if (creditCardCVC.length() == 3 && !creditCardCVC.isNaN()) valid = true;
      break;
    case "Discover":
      if (creditCardCVC.length() == 3 && !creditCardCVC.isNaN()) valid = true;
      break;
    case "Amex/Discover":
      if (
        (creditCardCVC.length() == 3 || creditCardCVC.length() == 4) &&
        !creditCardCVC.isNaN()
      )
        valid = true;
      break;
  }
  console.log("End of cardCVC function | Return type: " + valid);
  return valid;
}

//Frontend credit card formatting and validation END

//Backend card validation START

//Backend card validation END
