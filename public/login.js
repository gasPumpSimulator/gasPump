async function getTransactions() {
    const table = document.getElementById("table");
    const tableBody = table.querySelector("tbody");
    const reponse  = await fetch('http://localhost:3000/getTransactions', {
        method: 'GET',
        headers: {
            'Accept': 'applicaton/json',
            'Content-Type': 'application/json',
        },
    })
    const data = await reponse.json();
    console.log(data);
    tableBody.innerHTML = "";
    for(let x = 0; x < data.length; x++) {
        const rowElement = document.createElement("tr");
            const cellElement1 = document.createElement("td");
            cellElement1.textContent = data[x].id;
            rowElement.appendChild(cellElement1);

            const cellElement2 = document.createElement("td");
            cellElement2.textContent = data[x].gallons;
            rowElement.appendChild(cellElement2);

            const cellElement3 = document.createElement("td");
            cellElement3.textContent = data[x].price;
            rowElement.appendChild(cellElement3);

            const cellElement4 = document.createElement("td");
            cellElement4.textContent = data[x].time;
            rowElement.appendChild(cellElement4);

            tableBody.appendChild(rowElement);
        }

}


    /*

    tableBody.innerHTML = "";
    const bodyID = document.createElement("tr");
    bodyID.textContent = "23";
    tableBody.querySelector("tr").appendChild(bodyID);
*/
