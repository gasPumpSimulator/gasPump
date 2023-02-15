let chosenGasBool = false; 
let chosenGasNumber;
let chosenGasPrice = 0;
let paymentMethod = 'none';
let paymentMethodBool = false;
let inputField = document.getElementById('interface');
let decimalField = document.getElementById('decimal');
let currentInputNumber = '';
let cashAmount = 0;
let gasTankSize = 10;
let amountOfGas;
<<<<<<< HEAD
let gallonsPumped = 0;
let intervalId;
let cents = 0;
//Changes color of white pill shaped div above each gas type button
/*
=======



>>>>>>> 17f50a5e47ccc2248ae47446591f97e43d7bfa1c
function changeColor(input, price)
{
    let element = document.getElementById(input);
        if(!chosenGasBool)
        {
            element.style.backgroundColor = "red";
            chosenGasBool = true;
            chosenGasNumber = input;
            chosenGasPrice = price;
            console.log(chosenGasNumber, " ", price);
        }
}
*/
//Replaced code segment to change light color
function changeColor(buttonNum, input, price){
    let gasButton = document.getElementsByClassName("gas_buttons");
    let light = document.getElementsByClassName("light");
    for(let y = 0; y < gasButton.length; ++y){
        if(buttonNum === y){
            light[y].style.backgroundColor = "red";
        } else {
            light[y].style.backgroundColor = "white";
        }
    }

    chosenGasNumber = input;
    chosenGasPrice = price;
    console.log(chosenGasNumber, " ", price);
}

function reset()
{
    chosenGasBool = false;
    chosenGasPrice = 0;
    paymentMethod = 'none';
    paymentMethodBool = false;
    currentInputNumber = '';
    cashAmount = 0;
    gasTankSize = 0;
    if(chosenGasNumber)
    {
        let element=document.getElementById(chosenGasNumber);
        element.style.backgroundColor = "white";
    }
    chosenGasNumber = '';
    paymentMethod = 'none';
    inputField.innerHTML = 'Enter 1 for credit or 2 for cash';
}
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
            if(currentInputNumber.length > 16 || currentInputNumber.length < 16)
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
        inputField.innerHTML = Math.round(amountOfGas * 100)/100 +' gallons purchased';
    }
    else if(paymentMethod === 'credit')
    {
        amountOfGas = gasTankSize * chosenGasPrice;
        inputField.innerHTML = Math.round(amountOfGas * 100)/100 + ' dollars of gas purchase';
    }
}
// variables for interval timer
let gallonsPumped = 0;
let intervalId;
let decIntervalId;
let decimal = 0;

function showGallons() {
   intervalId =  setInterval(incrementGallons, 2000);
   
}

function incrementGallons() {
    if (gallonsPumped <= gasTankSize) {
        inputField.innerHTML = `Gallons: ${gallonsPumped}`;
        gallonsPumped += 1;
        decIntervalId = setInterval(incrementDecimal, 200);
    } else {
        clearInterval(intervalId);
        clearInterval(decIntervalId);
        inputField.innerHTML = 'Thank you! Would you like a reciept?';
    }
}

function incrementDecimal() {
     if (decimal < 10) {
        decimalField.innerHTML = `.${decimal}`;
        decimal += 1;
    } else {
        decimal = 0;
        clearInterval(decIntervalId);
    }
}