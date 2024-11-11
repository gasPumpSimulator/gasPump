let port = "localhost:3000";

// eslint-turnoff-next-line no-unused-vars
async function getTransactions() {
  const table = document.getElementById("table");
  const tableBody = table.querySelector("tbody");
  const reponse = await fetch(`http://${port}/getTransactions`, {
    method: "GET",
    headers: {
      Accept: "applicaton/json",
      "Content-Type": "application/json",
    },
  });

  const data = await reponse.json();
  tableBody.innerHTML = "";
  for (let x = 0; x < data.length; x++) {
    const rowElement = document.createElement("tr");
    const cellElement1 = document.createElement("td");
    cellElement1.textContent = data[x].ID;
    rowElement.appendChild(cellElement1);

    const cellElement2 = document.createElement("td");
    cellElement2.textContent = data[x].paymentMethod;
    rowElement.appendChild(cellElement2);

    const cellElement3 = document.createElement("td");
    cellElement3.textContent = data[x].gasType;
    rowElement.appendChild(cellElement3);

    const cellElement4 = document.createElement("td");
    cellElement4.textContent = "$" + data[x].pricePerGallon;
    rowElement.appendChild(cellElement4);

    const cellElement5 = document.createElement("td");
    cellElement5.textContent = data[x].gallonsPurchased;
    rowElement.appendChild(cellElement5);

    const cellElement6 = document.createElement("td");
    cellElement6.textContent = data[x].name;
    rowElement.appendChild(cellElement6);

    const cellElement7 = document.createElement("td");
    cellElement7.textContent = "$" + data[x].totalPrice;
    rowElement.appendChild(cellElement7);

    const cellElement8 = document.createElement("td");
    cellElement8.textContent = data[x].dateTime;
    rowElement.appendChild(cellElement8);

    tableBody.appendChild(rowElement);
  }
}
