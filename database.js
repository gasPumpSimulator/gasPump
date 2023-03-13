import dotenv from 'dotenv';
dotenv.config();

import connectionQuery from './ssh.js';



export async function getTransaction(id) {
    const rows = await connectionQuery(`SELECT * FROM transactions2 WHERE id = ${id}`);
    return rows;
}
export async function createTransaction(paymentMethod, gasType, pricePerGallon, gallonsPurchased, totalPrice, creditCardName) {
    const result = await connectionQuery(`INSERT INTO transactions2 (paymentMethod, gasType, pricePerGallon, gallonsPurchased, totalPrice, name) VALUES ("${paymentMethod}", "${gasType}",${pricePerGallon},${gallonsPurchased},${totalPrice}, "${creditCardName}")`);
    return result;
}
export async function checkUsernamePassword(username, password) {
    const result = await connectionQuery(`SELECT * FROM loginTable WHERE username = "${username}" AND password = ${password}`);
    return result;
}

export async function addUser(username, password) {
    const result = await connectionQuery(`SELECT * FROM loginTable WHERE username = "${username}"`);
    if(result.length > 0) {
        return false;
    } else {
        result = await connectionQuery(`INSERT INTO loginTable (username, password) VALUES ("${username}", "${password}")`);
        return result;
    }
}
export async function checkCreditCard(creditNum) {
    const result = await connectionQuery(`SELECT * FROM creditCards WHERE creditNumber = ${creditNum}`);
    return result;
}
export async function getTransactions() {
    const rows = await connectionQuery("SELECT * FROM transactions2");
    return rows;
}
// const transactions = await getTransactions();
// console.log(transactions);
//AND CVC = ${cvc}
// const result = await createTransaction(9.5, 31.99);
// console.log(result);