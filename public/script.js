let chosenGasBool = false; 
let chosenGasNumber;
let chosenGasPrice = 0;
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