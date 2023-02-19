let chosenGasBool = false; 
let chosenGasNumber;
let chosenGasPrice = 0;
let paymentMethod;
let paymentMethodBool = false;
let inputField = document.getElementById('interface');
let decimalField = document.getElementById('decimal');
let gallonsInput = document.getElementById('gallons');
let beginFuelingButton = document.getElementById('beginFueling');
    beginFuelingButton.disabled = true;
let currentInputNumber = '';
let cashAmount = 0;
let gasTankSize = 0;
let amountOfGas;
let decimalBool = false;
let stepInPumpProcess = 0;
let costOfGas = 0;

//disable unused buttons
document.getElementById('D').disabled = true;
document.getElementById('no').disabled = true;
document.getElementById('yes').disabled = true;

//determine payment type, 1st step in process
function paymentMethodFunction(input)
{
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
    }
    currentInputNumber = '';
    stepInPumpProcess++;
}
//3rd step in process
function tankSize() {
    if(currentInputNumber <= 0) {
        return;
    }
    if(paymentMethod === 'card') {
        gasTankSize = currentInputNumber;
        inputField.innerHTML = 'Chose type of gas';

    }
    stepInPumpProcess++;
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
        stepInPumpProcess++;
    } 
}
//compute amount of gas to be pumped 5th step
function amountOfGasPumped() {
    if(paymentMethod === 'cash') {
        amountOfGasPumped = cashAmount / chosenGasPrice;
        gasTankSize = amountOfGasPumped;
        inputField.innerHTML = Math.round(amountOfGasPumped * 100)/100 +' gallons purchased press BEGIN FUELING';
    } else if(paymentMethod === 'card') {
        costOfGas = gasTankSize * chosenGasPrice;
        inputField.innerHTML = Math.round(costOfGas * 100)/100 + ' dollars of gas purchased press BEGIN FUELING';
    }
    stepInPumpProcess++;
    beginFuelingButton.disabled = false;
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
        amountOfGasPumped();
        break;
    }
}



// variables for interval timer
let gallonsPumped = 0;
let intervalId;
let decIntervalId;
let decimal = 0;
let gallonBool = false;
//show gallons as they are being pumped
function showGallons() {
   inputField.innerHTML = "NOW FUELING";
   intervalId =  setInterval(incrementGallons, 2000);
   decimalBool = false;
   console.log('tank size ' + gasTankSize)
}
//increment gallons
function incrementGallons() {
    if (gallonsPumped <= gasTankSize && gallonBool === false) {
        gallonsInput.innerHTML = `Gallons: ${gallonsPumped}`;
        gallonsPumped += 1;
        decIntervalId = setInterval(incrementDecimal, 200);
    } else {
        console.log('end')
        return clearInterval(intervalId);

        // inputField.innerHTML = 'Thank you! Would you like a reciept?';
    }
}
//increment fraction of gallons
function incrementDecimal() {
    //if gallons is less than 10 increment decimal, otherwise set to 0 and return
    if (decimal < 10 && decimalBool === false) {
       decimalField.innerHTML = `.${decimal}`;
        //if gallons pumped has reached amount needed return and clear interval 
        let totalGallons = gallonsPumped + decimal * .1 + 1;   
  
        console.log('total ' + totalGallons)

        if(totalGallons > gasTankSize) {
            console.log('total gallons pumped ' + totalGallons);
            decimalBool = true;
            gallonbool = true;
            decimalField.innerHTML = `.${decimal}`;
            return clearInterval(decIntervalId);
        }
        decimal++;
   }
   else {
      if(gallonBool != true) {
        decimal = 0;
      }
      decimalField.innerHTML = `.${decimal}`;
      console.log('end decimal')
      return clearInterval(decIntervalId);
   } 
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
    chosenGasBool = false;
    chosenGasPrice = 0;
    paymentMethod = 'none';
    paymentMethodBool = false;
    currentInputNumber = '';
    cashAmount = 0;
    gasTankSize = 0;
    gallonsPumped = 0;
    gallonsInput.innerHTML = 'Gallons: 0';
    decimalField.innerHTML = '.00';
    if(chosenGasNumber)
    {
        let element=document.getElementById(chosenGasNumber);
        element.style.backgroundColor = "white";
    }
    chosenGasNumber = '';
    paymentMethod = 'none';
    inputField.innerHTML = 'Enter 1 for credit or 2 for cash';
}