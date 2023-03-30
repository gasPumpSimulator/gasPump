/* eslint-disable no-unused-vars */
let chosenGasBool = false;
let chosenGasNumber;
let chosenGasPrice = 0;
let paymentMethod;
let outputField = document.getElementById("interface");
let gallonDisplayField = document.getElementById("gallonDisplay");
let gallonsInput = document.getElementById("gallons");
let inputField = document.getElementById("input");
let beginFuelingButton = document.getElementById("beginFueling");
let emergencyShutoff = document.getElementById("emergencyShutoff");
let currentInput = "";
let cashAmount = 0;
let gasTankSize = 0;
let stepInPumpProcess = 1;
let costOfGas = 0;
let emergencyStop = false;
/* exported creditCardNumber */
let creditCardNumber;
let userName;
let creditCardName = "cash(none)";
let port = "localhost:3000";
let timeoutID;
let receiptBool = false;
let cvcCode;
let creditExp;

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
    paymentMethod = "card";
  } else {
    message = "input cash amount and press ENTER";
    paymentMethod = "cash";
  }
  outputField.innerHTML = message;
  stepInPumpProcess++;
}
//2nd step in process, checks credit name or amount of gas using cash, skips credit steps if cash
async function checkCreditNameOrCash() {
  if (currentInput === "") {
    return;
  }
  if (paymentMethod === "card") {
    userName = currentInput;
    outputField.innerHTML = "Enter credit card number then press enter";
    stepInPumpProcess++;
  } else {
    cashAmount = currentInput;
    outputField.innerHTML = `$${cashAmount} of gas purchased, choose gas type then press enter`;
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
  gasTankSize = currentInput;
  outputField.innerHTML = "Choose type of gas and press enter";
  currentInput = "";
  inputField.value = "";
}

//change color of button for chosen gas type 4th step
function changeColor(input, inputedPrice) {
  let price = document.getElementById(inputedPrice).innerHTML;
  price = price.replace("$", "");
  let ChosenButton = document.getElementById(input);
  if (!chosenGasBool && (gasTankSize != 0 || cashAmount != 0)) {
    ChosenButton.style.backgroundColor = "red";
    chosenGasBool = true;
    chosenGasNumber = input;
    chosenGasPrice = price;
  }
}

//compute amount of gas to be pumped 7th step
function amountOfGasPumped() {
  if (!chosenGasBool) {
    return;
  }
  if (paymentMethod === "cash") {
    let amountOfGas = cashAmount / chosenGasPrice;
    gasTankSize = amountOfGas;
    costOfGas = cashAmount;
    outputField.innerHTML =
      Math.round(amountOfGas * 100) / 100 +
      " gallons purchased press BEGIN FUELING";
  } else if (paymentMethod === "card") {
    costOfGas = gasTankSize * chosenGasPrice;
    outputField.innerHTML =
      "$" +
      Math.round(costOfGas * 100) / 100 +
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
// variables for interval timer
let gallonsPumped = 0;
let intervalId;

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
    gallonsPumped === Math.round(gasTankSize * 100) / 100 ||
    emergencyStop === true
  ) {
    gallonsInput.innerHTML = " " + gallonsPumped;
    if (emergencyStop === true) {
      inputField.innerHTML = "Emergency stop initiated";
    } else {
      inputField.innerHTML = "Done Fueling";
    }
    postTransaction(
      paymentMethod,
      chosenGasNumber,
      chosenGasPrice,
      gallonsPumped,
      costOfGas,
      creditCardName
    );
    clearInterval(intervalId);
    timeoutID = setTimeout(askReceipt, 3000);
  } else {
    gallonsInput.innerHTML = " " + gallonsPumped;
  }
}

function askReceipt() {
  clearTimeout(timeoutID);
  inputField.innerHTML =
    "Would you like a receipt? Press ENTER for YES, RESET for NO";
  gallonDisplayField.innerHTML = "";
  gallonsInput.innerHTML = "";
  receiptBool = true;
}

function displayreceipt() {
  alert(
    `Thank you for your purchase! Gallons pumped: ${gallonsPumped} || Price: ${costOfGas} || Enter email address for printed receipt`
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
  if (emergencyStop || inputField.innerHTML === "Done Fueling") {
    currentInput = "";
    cashAmount = 0;
    gasTankSize = 0;
    stepInPumpProcess = 1;
    costOfGas = 0;
    chosenGasBool = false;
    chosenGasPrice = 0;
    paymentMethod = "none";
    gallonsPumped = 0;
    if (chosenGasNumber) {
      let element = document.getElementById(chosenGasNumber);
      element.style.backgroundColor = "white";
    }
    chosenGasNumber = "";
    outputField.innerHTML = "Enter 1 for credit or 2 for cash";
    inputField.value = "";
    gallonsInput.innerHTML = "";
    gallonDisplayField.innerHTML = "";
    beginFuelingButton.disabled = true;
    emergencyShutoff.disabled = true;
    emergencyStop = false;
  } else if (!emergencyShutoff.disabled) {
    return;
  }
}
// add transaction to db
async function postTransaction(
  paymentMethod,
  gasType,
  pricePerGallon,
  gallonsPurchased,
  totalPrice
) {
  fetch(`http://${port}/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentMethod: paymentMethod,
      gasType: gasType,
      pricePerGallon: pricePerGallon,
      gallonsPurchased: gallonsPurchased,
      totalPrice: totalPrice,
      creditCardName: creditCardName,
    }),
  })
    .then((response) => response.json())
    .then((response) => console.log(JSON.stringify(response)));
}
async function databaseCreditNumCheck(creditNum) {
  const response = await fetch(`http://${port}/creditNumCheck`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      creditNumber: creditNum,
    }),
  });
  const data = await response.json();
  if (data.length < 1) {
    return false;
  } else {
    creditCardName = data[0].name;
    return true;
  }
}
