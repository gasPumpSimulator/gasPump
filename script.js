let chosenGasBool = false; 
let chosenGasNumber;
function changeColor(input)
{
    let element=document.getElementById(input);
    if(!chosenGasBool)
    {
        element.style.backgroundColor = "red";
        chosenGasBool = true;
        chosenGasNumber = input;
        console.log(chosenGasNumber);
    }



}

function addToEquation(input) {
    document.getElementById('screen').innerHTML = input;
}

function deleteEntry() {
    document.getElementById('screen').innerHTML = 'SCREEN';
}