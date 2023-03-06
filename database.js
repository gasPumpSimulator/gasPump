import dotenv from 'dotenv';
dotenv.config();

import connectionQuery from './ssh.js';

export async function getTransactions() {
    const rows = await connectionQuery("SELECT * FROM transactions2");
    return rows;
}

export async function getTransaction(id) {
    const rows = await connectionQuery(`SELECT * FROM transactions2 WHERE id = ${id}`);
    return rows;
}
export async function createTransaction(paymentMethod, gasType, pricePerGallon, gallonsPurchased, totalPrice) {
    const result = await connectionQuery(`INSERT INTO transactions2 (paymentMethod, gasType, pricePerGallon, gallonsPurchased, totalPrice) VALUES ("${paymentMethod}", "${gasType}",${pricePerGallon},${gallonsPurchased},${totalPrice})`);
    return result;
}
export async function checkUsernamePassword(username, password) {
    const result = await connectionQuery(`SELECT * FROM loginTable WHERE username = "${username}" AND password = ${password}`);
    return result;
}

export async function checkCreditCard(number) {
    const result = await connectionQuery(`SELECT * FROM creditCards WHERE creditNumber = ${number}`)
    console.log('test');
    return result;
}
// const transactions = await getTransactions();
// console.log(transactions);
//AND CVC = ${cvc}
// const result = await createTransaction(9.5, 31.99);
// console.log(result);