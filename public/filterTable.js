
const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", addTxt);

function addTxt() {
   let idValue = parseInt(document.getElementsByName("searchByID")[0].value);
   const table = document.getElementById("table");
   const tbody = table.querySelector("tbody");
const tableLength = tbody.rows.length;
for(let x = 1; x <= tableLength;) {
    if(tbody.rows.length === 1) {
        break;
    }
    let cellValue = parseInt(table.rows[x].cells[0].innerHTML);
    if(cellValue !== idValue) {
        table.deleteRow(x);
    } else {
        x++;
    }
}

}


/*if(table.rows[x].cells[0] !== 4) {
    table.deleteRow(x);
    console.log(table.rows[x].cells[0])
} else {
    console.log(table.rows[x].cells[0])
}*/