
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", addTxt);


async function addTxt() {
    await getTransactions();
    const userChoices = [];
    const idValue = document.getElementsByName("searchByID")[0].value;
    const nameValue = document.getElementsByName("name")[0].value;
    const paymentMethod = document.getElementsByName("paymentMethod")[0].value;
    const gasType = document.getElementsByName("gasType")[0].value;
    const pricePerGallon = document.getElementsByName("pricePerGallon")[0].value;
    const maxPricePerGallon = document.getElementsByName("maxPricePerGallon")[0].value;
    const minPricePerGallon = document.getElementsByName("minPricePerGallon")[0].value;
    const gallonsPurchased = document.getElementsByName("GallonsPurchased")[0].value;
    const minGallonsPurchased = document.getElementsByName("minGallonsPurchased")[0].value;
    const maxGallonsPurchased = document.getElementsByName("maxGallonsPurchased")[0].value;
    const totalCost = document.getElementsByName("totalCost")[0].value;
    const maxTotalCost =  document.getElementsByName("maxTotalCost")[0].value;
    const minTotalCost = document.getElementsByName("minTotalCost")[0].value;
    const minTime = document.getElementsByName("startTime")[0].value;
    const maxTime = document.getElementsByName("endTime")[0].value;
    //0
    userChoices.push(idValue);
    //1
    userChoices.push(nameValue);
    //2
    userChoices.push(paymentMethod);
    //3
    userChoices.push(pricePerGallon);
    userChoices.push(maxPricePerGallon);
    userChoices.push(minPricePerGallon);
    //6
    userChoices.push(gallonsPurchased);
    userChoices.push(minGallonsPurchased);
    userChoices.push(maxGallonsPurchased);
    //9
    userChoices.push(totalCost);
    userChoices.push(maxTotalCost);
    userChoices.push(minTotalCost);
    //12
    userChoices.push(minTime);
    userChoices.push(maxTime);















    const table = document.getElementById("table");
    const tbody = table.querySelector("tbody");
    const tableLength = tbody.rows.length;
    console.log("test value " +userChoices[0])

    let row = 1;
    while(row <= tableLength && tbody.rows.length > 0) {
        let tableValues = [];
        tableValues[0] = table.rows[row].cells[0].innerHTML;
        tableValues[1] = table.rows[row].cells[1].innerHTML;
        tableValues[2] = table.rows[row].cells[2].innerHTML;
        tableValues[3] = table.rows[row].cells[3].innerHTML;
        tableValues[4] = parseInt(table.rows[row].cells[4].innerHTML);
        tableValues[5] = table.rows[row].cells[5].innerHTML;
        tableValues[6] = table.rows[row].cells[6].innerHTML;
        tableValues[7] = table.rows[row].cells[7].innerHTML;
        console.log("----------------------------------------");
      //  for(let column = 0; column < 8; column++) {
       // }
        console.log("table values " + tableValues[0])
        console.log("user choice " + userChoices[0])
        console.log("table name " + tableValues[1])
        console.log("user name " + userChoices[2])
        if(userChoices[0] !== "any") {
            if(tableValues[0] !== userChoices[0]) {
                table.deleteRow(row);
                continue;
            } 
        }
        if(tableValues[1] !== userChoices[2]) {
            table.deleteRow(row);
        } else {
            row++;
        }
    }

}
