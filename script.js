let chosenGasBool = false; 
let chosenGasNumber;
let chosenGasPrice = 0;
function changeColor(input, price)
{
    let element=document.getElementById(input);
    if(!chosenGasBool)
    {
        element.style.backgroundColor = "red";
        chosenGasBool = true;
        chosenGasNumber = input;
        chosenGasPrice = price;
        console.log(chosenGasNumber, " ", price);
    }
}
function reset()
{
    chosenGasBool = false;
    chosenGasPrice = 0;
    let element=document.getElementById(chosenGasNumber);
    element.style.backgroundColor = "white";
}




function addToEquation(input) {
    document.getElementById('screen').innerHTML = input;
}

function deleteEntry() {
    document.getElementById('screen').innerHTML = 'SCREEN';
}