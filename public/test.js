let transactionObject = {
  chosenGasNumber: "df",
  chosenGasPrice: "f",
  paymentMethod: "f",
  cashAmount: "d",
  gasTankSize: "d",
  // eslint-disable-next-line no-dupe-keys
  cashAmount: "d",
  costOfGas: "d",
  creditCardNumber: "d",
  creditCardName: "d",
  cvcCode: "d",
  creditExp: "s",
};

for (let key in transactionObject) {
  transactionObject.key = "test";
  console.log(transactionObject.key);
}
