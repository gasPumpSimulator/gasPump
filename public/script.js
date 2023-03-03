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
function gallonsOrDollars() {
    if (paymentMethod === 'card') {
        if(currentInputNumber.length > 4 || currentInputNumber.length < 4)
        {
            inputField.innerHTML = 'Invalid credit card info';
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
        postTransaction(gallonsPumped, costOfGas);
        clearInterval(intervalId);
    } else {
        gallonsInput.innerHTML = ' ' + gallonsPumped;
    }
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
let periodBtn = document.getElementById('period')

const baseUrl = 'http://localhost:3000/getPrices'

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
    if(emergencyStop || inputField.innerHTML === 'Done Fueling') {
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
async function postTransaction(gallons, price) {
    fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "gallons": gallons, "price": price})
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
}

