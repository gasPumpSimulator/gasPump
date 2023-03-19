
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", addTxt);


async function addTxt() {
    await getTransactions();
    let idValue = document.getElementsByName("searchByID")[0].value;
    if(idValue === "any") {
        return;
    }
    const table = document.getElementById("table");
    const tbody = table.querySelector("tbody");
    const tableLength = tbody.rows.length;
    let x = 1;
    while(x <= tableLength && tbody.rows.length > 0) {
        let cellValue = parseInt(table.rows[x].cells[0].innerHTML);
        if(cellValue !== parseInt(idValue)) {
            table.deleteRow(x);
        } else {
            x++;
        }
    }

}
