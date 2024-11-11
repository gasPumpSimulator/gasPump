const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", addTxt);

function getCurrentDate() {
  const endTime = document.getElementById("endTime");
  let n = new Date();
  const y = n.getFullYear();
  const m = n.getMonth() + 1;
  const d = n.getDate();
  console.log(d);
  if (m < 10) {
    n = `${y}-0${m}-${d}`;
  } else {
    n = `${y}-${m}-${d}`;
  }
  endTime.value = n;
  console.log("user time ", endTime.value);
}
//onload get current date
window.onload(getCurrentDate());
//sort data in table
async function addTxt() {
  // eslint-turnoff-next-line no-undef
  await getTransactions();
  const userChoices = [];
  const idValue = document.getElementsByName("searchByID")[0].value;
  const nameValue = document.getElementsByName("name")[0].value;
  const paymentMethod = document.getElementsByName("paymentMethod")[0].value;
  const gasType = document.getElementsByName("gasType")[0].value;
  const pricePerGallon = document.getElementsByName("pricePerGallon")[0].value;
  const maxPricePerGallon =
    document.getElementsByName("maxPricePerGallon")[0].value;
  const minPricePerGallon =
    document.getElementsByName("minPricePerGallon")[0].value;
  const gallonsPurchased =
    document.getElementsByName("GallonsPurchased")[0].value;
  const minGallonsPurchased = document.getElementsByName(
    "minGallonsPurchased"
  )[0].value;
  const maxGallonsPurchased = document.getElementsByName(
    "maxGallonsPurchased"
  )[0].value;
  const totalCost = document.getElementsByName("totalCost")[0].value;
  const maxTotalCost = document.getElementsByName("maxTotalCost")[0].value;
  const minTotalCost = document.getElementsByName("minTotalCost")[0].value;
  const minTime = document.getElementsByName("startTime")[0].value;
  const maxTime = document.getElementsByName("endTime")[0].value;
  //0 done
  userChoices.push(idValue);
  //1 done
  userChoices.push(nameValue);
  //2 done
  userChoices.push(paymentMethod);
  //3 done
  userChoices.push(pricePerGallon);
  userChoices.push(maxPricePerGallon);
  userChoices.push(minPricePerGallon);
  //6 done
  userChoices.push(gallonsPurchased);
  userChoices.push(Number(maxGallonsPurchased));
  userChoices.push(Number(minGallonsPurchased));
  //9 done
  userChoices.push(totalCost);
  userChoices.push(Number(maxTotalCost));
  userChoices.push(Number(minTotalCost));
  //12
  userChoices.push(minTime);
  userChoices.push(maxTime);
  //14 done
  userChoices.push(gasType);

  const table = document.getElementById("table");
  const tbody = table.querySelector("tbody");
  const tableLength = tbody.rows.length;

  let row = 1;
  let tableValues = [];
  while (row <= tableLength && tbody.rows.length > 0) {
    tableValues[0] = table.rows[row].cells[0].innerHTML;
    tableValues[1] = table.rows[row].cells[1].innerHTML;
    tableValues[2] = table.rows[row].cells[2].innerHTML;
    tableValues[3] = table.rows[row].cells[3].innerHTML.slice(1);
    tableValues[4] = Number(table.rows[row].cells[4].innerHTML);
    tableValues[5] = table.rows[row].cells[5].innerHTML;
    tableValues[6] = Number(table.rows[row].cells[6].innerHTML.slice(1));
    tableValues[7] = table.rows[row].cells[7].innerHTML.slice(0, -14);
    //price per gallon check
    if (userChoices[3] !== "any") {
      if (userChoices[3] === "min") {
        if (tableValues[3] < userChoices[5]) {
          table.deleteRow(row);
          continue;
        }
      } else if (userChoices[3] === "max") {
        if (tableValues[3] > userChoices[4]) {
          table.deleteRow(row);
          continue;
        }
      } else {
        if (
          tableValues[3] < userChoices[5] ||
          tableValues[3] > userChoices[4]
        ) {
          table.deleteRow(row);
          continue;
        }
      }
    }
    //total cost check
    if (userChoices[9] !== "any") {
      if (userChoices[9] === "min") {
        if (tableValues[6] < userChoices[11]) {
          table.deleteRow(row);
          continue;
        }
      } else if (userChoices[9] === "max") {
        if (tableValues[6] > userChoices[10]) {
          table.deleteRow(row);
          continue;
        }
      } else {
        if (
          tableValues[6] < userChoices[11] ||
          tableValues[6] > userChoices[10]
        ) {
          table.deleteRow(row);
          continue;
        }
      }
    }
    //gallons purchased check
    if (userChoices[6] !== "any") {
      if (userChoices[6] === "min") {
        if (tableValues[4] < userChoices[8]) {
          table.deleteRow(row);
          continue;
        }
      } else if (userChoices[6] === "max") {
        if (tableValues[4] > userChoices[7]) {
          table.deleteRow(row);
          continue;
        }
      } else {
        if (
          tableValues[4] < userChoices[8] ||
          tableValues[4] > userChoices[7]
        ) {
          table.deleteRow(row);
          continue;
        }
      }
    }
    //check dates
    if (tableValues[7] < userChoices[12]) {
      table.deleteRow(row);
      continue;
    }
    if (tableValues[7] > userChoices[13]) {
      table.deleteRow(row);
      continue;
    }
    if (userChoices[0] !== "any") {
      if (tableValues[0] !== userChoices[0]) {
        table.deleteRow(row);
        continue;
      }
    }
    if (userChoices[1] !== "any") {
      if (tableValues[5] !== userChoices[1]) {
        table.deleteRow(row);
        continue;
      }
    }
    if (userChoices[2] !== "any") {
      if (tableValues[1] !== userChoices[2]) {
        table.deleteRow(row);
        continue;
      }
    }
    if (userChoices[14] !== "any") {
      if (tableValues[2] !== userChoices[14]) {
        table.deleteRow(row);
        continue;
      } else {
        row++;
      }
    } else {
      row++;
    }
  }
}
