let chosenGasBool = false; 
let chosenGasNumber;
let chosenGasPrice = 0;
let paymentMethod;
let inputField = document.getElementById('interface');
let gallonDisplayField = document.getElementById('gallonDisplay');
let gallonsInput = document.getElementById('gallons');
let beginFuelingButton = document.getElementById('beginFueling');
let emergencyShutoff = document.getElementById('emergencyShutoff');
let currentInputNumber = '';
let cashAmount = 0;
let gasTankSize = 0;
let stepInPumpProcess = 0;
let costOfGas = 0;
let emergencyStop = false;
let creditCardNumber;
let userName;
let creditCardName = "cash(none)";
let port = "localhost:3000";
let timeoutID;
let receiptBool = false;
let cvcCode;
let creditExp;

//disable unused buttons
document.getElementById('D').disabled = true;
document.getElementById('no').disabled = true;
document.getElementById('yes').disabled = true;

//disable beginFueling button
beginFuelingButton.disabled = true;
emergencyShutoff.disabled = true;

//determine payment type, 1st step in process
function paymentMethodFunction(input) {
    let message;
    if(stepInPumpProcess >= 3) {
        return;
    }
    if(stepInPumpProcess != 0) {
        addToInput(input);
        return;
    }
    else if(input === 1) {
        message = "input credit card number and press ENTER";
        paymentMethod = 'card';
    }
    else {
        message = "input cash amount and press ENTER";
        paymentMethod = 'cash';
    }
    inputField.innerHTML = message;
    stepInPumpProcess++;
}

//2nd step in process
async function gallonsOrDollars() {
    if (paymentMethod === 'card') {
        if(currentInputNumber.length > 4 || await databaseCreditNumCheck(currentInputNumber) == false)
        {
            inputField.innerHTML = 'Invalid credit card info';
            currentInputNumber = "";
            return;
        } else {
            inputField.innerHTML = 'Enter size of gas tank and press ENTER';
        } 
    } else if(paymentMethod === 'cash') {
        cashAmount = currentInputNumber;
        if(currentInputNumber === '') {
            return;
        }
        inputField.innerHTML = `$${cashAmount} of gas purchased, choose gas type`;
        stepInPumpProcess++;
    }
    currentInputNumber = '';
    stepInPumpProcess++;
}

//3rd step in process
function tankSize() {
    if(currentInputNumber <= 0) {
        return;
    }
    stepInPumpProcess++;
    gasTankSize = currentInputNumber;
    inputField.innerHTML = 'Choose type of gas';
}

//change color of button for chosen gas type 4th step
function changeColor(input, inputedPrice) {
    let price = document.getElementById(inputedPrice).innerHTML;
    price = price.replace('$', '');
    let ChosenButton = document.getElementById(input);
    if(!chosenGasBool && (gasTankSize != 0 || cashAmount != 0)) {
        ChosenButton.style.backgroundColor = "red";
        chosenGasBool = true;
        chosenGasNumber = input;
        chosenGasPrice = price;
    } 
}

//compute amount of gas to be pumped 5th step
function amountOfGasPumped() {
    if(!chosenGasBool) {
        return;
    }
    if(paymentMethod === 'cash') {
        let amountOfGas = cashAmount / chosenGasPrice;
        gasTankSize = amountOfGas;
        costOfGas = cashAmount;
        inputField.innerHTML = Math.round(amountOfGas * 100)/100 +' gallons purchased press BEGIN FUELING';
    } else if(paymentMethod === 'card') {
        costOfGas = gasTankSize * chosenGasPrice;
        inputField.innerHTML = '$' + Math.round(costOfGas * 100)/100 + ' of gas purchased press BEGIN FUELING';
    }
    stepInPumpProcess++;
    beginFuelingButton.disabled = false;
    emergencyShutoff.disabled = false;
}

//add input to current input
function addToInput(input) {
    if(stepInPumpProcess >= 3 || cashAmount > 0) {
        return;
    }
    if(stepInPumpProcess != 0) {
        currentInputNumber += input;
        inputField.innerHTML = currentInputNumber;
    }
}

//switch statement for process
function compute() {   
    switch(stepInPumpProcess) {
    case 1:  
        gallonsOrDollars();
        break;
    case 2:
        tankSize();
        break;
    case 3:
        amountOfGasPumped();
        break;
    case 4: 
        displayReceipt();
    } 
}
// variables for interval timer
let gallonsPumped = 0;
let intervalId;

//show gallons as they are being pumped
function showGallons() {
    //send post request of gallons and price
    //postTransaction(gasTankSize, price);
   inputField.innerHTML = "NOW FUELING";
   gallonDisplayField.innerHTML = 'Gallons Pumped:  ';
   intervalId =  setInterval(incrementGallons, 10);
}

//increment gallons
function incrementGallons() {
    gallonsPumped += .01;
    gallonsPumped = Math.round(gallonsPumped * 100)/100;
    if(gallonsPumped === Math.round(gasTankSize * 100)/100 || emergencyStop === true) {
        gallonsInput.innerHTML = ' ' + gallonsPumped;
        if(emergencyStop === true) {
            inputField.innerHTML = 'Emergency stop initiated';
        } else {
            inputField.innerHTML = 'Done Fueling';
        }
        postTransaction(paymentMethod, chosenGasNumber, chosenGasPrice, gallonsPumped, costOfGas, creditCardName);
        clearInterval(intervalId);
        timeoutID = setTimeout(askReceipt, 3000);
    } else {
        gallonsInput.innerHTML = ' ' + gallonsPumped;
    }
}  

function askReceipt() {
    clearTimeout(timeoutID);
    inputField.innerHTML = 'Would you like a receipt? Press ENTER for YES, RESET for NO';
    gallonDisplayField = ' ';
    gallonsInput.innerHTML = ' ';
    receiptBool = true;
}

function displayReceipt() {
    alert(`Thank you for your purchase! Gallons pumped: ${gallonsPumped} || Price: ${costOfGas} || Enter your email address for printed receipt`);
}

//emergency shutoff
function stopFueling() {
    emergencyStop = true;
}

//frontend for getting data for gas prices API
let gasPrice87 = document.getElementById('price87');
let gasPrice89 = document.getElementById('price89');
let gasPrice93 = document.getElementById('price93');
let gasPriceDiesel = document.getElementById('priceDiesel');
let periodBtn = document.getElementById('period');

const baseUrl = `http://${port}/getPrices`

async function getPrices() {
    const response = await fetch(baseUrl,
    {
        method: 'GET'
    })
    const data = await response.json()
    gasPrice87.innerHTML = data[0];
    gasPrice89.innerHTML = data[1];
    gasPrice93.innerHTML = data[2];
    gasPriceDiesel.innerHTML = data[3];
}

//reset everything for new transaction
function reset()
{
    if(emergencyStop || inputField.innerHTML === 'Done Fueling' || receiptBool === true) {
        currentInputNumber = '';
        cashAmount = 0;
        gasTankSize = 0;
        stepInPumpProcess = 0;
        costOfGas = 0;
        chosenGasBool = false; 
        chosenGasPrice = 0;
        paymentMethod = 'none';
        gallonsPumped = 0;
        if(chosenGasNumber) {
            let element=document.getElementById(chosenGasNumber);
            element.style.backgroundColor = "white";
        }
        chosenGasNumber = '';
        inputField.innerHTML = 'Enter 1 for credit or 2 for cash';
        gallonsInput.innerHTML = '';
        gallonDisplayField.innerHTML = '';
        beginFuelingButton.disabled = true;
        emergencyShutoff.disabled = true;
        emergencyStop = false;
    } else if (!emergencyShutoff.disabled) {
            return;
    }
}
// add transaction to db
async function postTransaction(paymentMethod, gasType, pricePerGallon, gallonsPurchased, totalPrice) {
    fetch(`http://${port}/transactions`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
        "paymentMethod": paymentMethod, "gasType": gasType,
        "pricePerGallon": pricePerGallon,
        "gallonsPurchased": gallonsPurchased,
        "totalPrice": totalPrice,
        "creditCardName": creditCardName,
        })
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
}
async function databaseCreditNumCheck(creditNum) {
    const response = await fetch(`http://${port}/creditNumCheck`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "creditNumber": creditNum
        })
    })
    const data = await response.json();
    if (data.length < 1) {
        return false;
    } else {
        creditCardName = data[0].name;
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
    for(let i = 0; i < 6; ++i)
    {
        switch(i)
        {
            case 0: //American Express (Amex/AmEx)
                cardno = /^(?:3[47][0-9]{13})$/;
                if(currentInputNumber.value.match(cardno)) {
                    cardNoValid = true;
                    creditCardName = 'Amex';
                }
                break;
            case 1: //Visa
                cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
                if(currentInputNumber.value.match(cardno)) {
                    cardNoValid = true;
                    creditCardName = 'Visa';
                }
                break;
            case 2: //Mastercard
                cardno = /^(?:5[1-5][0-9]{14})$/;
                if(currentInputNumber.value.match(cardno)){
                    cardNoValid = true;
                    creditCardName = 'Mastercard';
                }
                break;
            case 3: //Discover
                cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
                if(currentInputNumber.value.match(cardno)) {
                    cardNoValid = true;
                    creditCardName = 'Discover';
                }
                break;
            case 4: //Diners club
                cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
                if(currentInputNumber.value.match(cardno)) {
                    cardNoValid = true;
                    creditCardName = 'Discover';
                }
                break;
            case 5: //JCB
                cardno = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
                if(currentInputNumber.value.match(cardno)) {
                    cardNoValid = true;
                    creditCardName = 'Amex/Discover';
                }
                break;
        }
    }
    console.log("End of cardNum function \nReturn type: " + cardNoValid + "\nCard type: " + creditCardName);
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

function cardCVC(_creditCardName){
    let valid = false;
    switch(_creditCardName){
        case 'Amex':
            if(creditCardCVC.length() == 4 && !creditCardCVC.isNaN()) valid = true;
            break;
        case 'Visa':
            if(creditCardCVC.length() == 3 && !creditCardCVC.isNaN()) valid = true;
            break;
        case 'Mastercard':
            if(creditCardCVC.length() == 3 && !creditCardCVC.isNaN()) valid = true;
            break;
        case 'Discover':
            if(creditCardCVC.length() == 3 && !creditCardCVC.isNaN()) valid = true;
            break;
        case 'Amex/Discover':
            if((creditCardCVC.length() == 3 || creditCardCVC.length() == 4) && !creditCardCVC.isNaN()) valid = true;
            break;
    }
    console.log("End of cardCVC function | Return type: " + valid)
    return valid;
}

//Frontend credit card formatting and validation END

//Backend card validation START



//Backend card validation END