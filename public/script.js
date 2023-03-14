let chosenGasBool = false; 
let chosenGasNumber;
let chosenGasPrice = 0;
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> c984a8aabbd591308253c55a6ac1937236598bad
let paymentMethod = 'none';
let paymentMethodBool = false;
let inputField = document.getElementById('interface');
let decimalField = document.getElementById('decimal');
let gallonsInput = document.getElementById('gallons');
let beginFuelingButton = document.getElementById('beginFueling');
    beginFuelingButton.disabled = true;
let currentInputNumber = '';
let cashAmount = 0;
let gasTankSize;
let amountOfGas;
let decimalBool = false;


//change color of button for chosen gas type
function changeColor(input, inputedPrice)
{
    let price=document.getElementById(inputedPrice).innerHTML;
    price=price.replace('$', '');
    let element=document.getElementById(input);
    if(!chosenGasBool && paymentMethod != 'none')
    {
        element.style.backgroundColor = "red";
        chosenGasBool = true;
        chosenGasNumber = input;
        chosenGasPrice = price;
        console.log(chosenGasNumber, " ", price);
    }
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
    decimalField.innerHTML = '';
    if(chosenGasNumber)
    {
        let element=document.getElementById(chosenGasNumber);
        element.style.backgroundColor = "white";
    }
    chosenGasNumber = '';
    paymentMethod = 'none';
    inputField.innerHTML = 'Enter 1 for credit or 2 for cash';
}
//determine payment type
function paymentMethodFunction(input)
{
    let message;
    let inputValue;
    
    if(input === 'credit')
    {
        message = "input credit card number and press ENTER";
        inputValue = '1';
    }
    else
    {
        message = "input cash amount and press ENTER";
        inputValue = '2';
    }
    if(paymentMethod === 'none')
    {
        paymentMethod = input;
        inputField.innerHTML = message;
    }
    else
    {
        addToInput(inputValue);
    }
}
//add input to current input
function addToInput(input) 
{
    currentInputNumber += input;
    inputField.innerHTML = currentInputNumber;
}

function deleteEntry() {
    document.getElementById('screen').innerHTML = 'SCREEN';
}

function compute()
{
    if(!paymentMethodBool)
    {
        if(paymentMethod === 'credit')
        {   
            if(currentInputNumber.length > 4 || currentInputNumber.length < 4)
            {
                inputField.innerHTML = 'Invalid credit card info';
            }
            else
            {
                inputField.innerHTML = 'Enter size of gas tank and press ENTER';
            }
        }
        else if(paymentMethod === 'cash')
        {
            cashAmount = currentInputNumber;
        }
        paymentMethodBool = true;
        currentInputNumber = '';
        return;
    }
    else if(!gasTankSize && paymentMethod != 'cash')
    {
        gasTankSize = currentInputNumber;
        if(!chosenGasNumber)
        {
            inputField.innerHTML = 'Select Gas type and press ENTER';
            return;
        }
    }
    else if(!chosenGasNumber)
    {
        inputField.innerHTML = 'Choose gas type and press ENTER';
        return;
    }
    if(paymentMethod === 'cash')
    {
        amountOfGas = cashAmount / chosenGasPrice;
        gasTankSize = Math.floor(Math.random() * (amountOfGas - 3) + 3);
        inputField.innerHTML = Math.round(amountOfGas * 100)/100 +' gallons purchased';
        beginFuelingButton.disabled = false;
    }
    else if(paymentMethod === 'credit')
    {
        amountOfGas = gasTankSize * chosenGasPrice;
        inputField.innerHTML = Math.round(amountOfGas * 100)/100 + ' dollars of gas purchased';
        beginFuelingButton.disabled = false;
    }
}

// variables for interval timer
let gallonsPumped = 0;
let intervalId;
let decIntervalId;
let decimal = 0;
//show gallons as they are being pumped
function showGallons() {
   inputField.innerHTML = "NOW FUELING";
   intervalId =  setInterval(incrementGallons, 2000);
   decimalBool = false;
}
//increment gallons
function incrementGallons() {
    if (gallonsPumped <= gasTankSize) {
        gallonsInput.innerHTML = `Gallons: ${gallonsPumped}`;
        gallonsPumped += 1;
        decIntervalId = setInterval(incrementDecimal, 200);
    } else {
        return clearInterval(intervalId);
        // inputField.innerHTML = 'Thank you! Would you like a reciept?';
    }
}
//increment fraction of gallons
function incrementDecimal() {
    //if gallons is less than 10 increment decimal, otherwise set to 0 and return
    if (decimal < 10 && decimalBool === false) {
       decimalField.innerHTML = `.${decimal}`;
       decimal += 1;
   }
   else {
      decimal = 0;
      decimalField.innerHTML = `.${decimal}`;
      return clearInterval(decIntervalId);
   } 
   //if gallons pumped has reached amount needed return and clear interval   
   if(gallonsPumped > gasTankSize) {
       decimalBool = true;
       return clearInterval(decIntervalId);
   }
}

//frontend for getting data for gas prices API

<<<<<<< HEAD
=======
>>>>>>> main
>>>>>>> c984a8aabbd591308253c55a6ac1937236598bad
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> main
>>>>>>> c984a8aabbd591308253c55a6ac1937236598bad
}