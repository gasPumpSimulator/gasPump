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
export async function checkUsernamePassword(username) {
    const result = await connectionQuery(`SELECT password, salt FROM loginTable WHERE username = "${username}"`);
    return result;
}

export async function addUser(username, password, salt) {
    let result = await connectionQuery(`SELECT * FROM loginTable WHERE username = "${username}"`);
    if(result.length > 0) {
        return false;
    } else {
        result = await connectionQuery(`INSERT INTO loginTable (username, password, salt) VALUES ("${username}", "${password}", "${salt}")`);
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
export async function getCustomQuery(gasType) {
    const rows = await connectionQuery(`SELECT * FROM transactions2 WHERE gasType = "${gasType}"`);
    return rows;
}
// const transactions = await getTransactions();
// console.log(transactions);
//AND CVC = ${cvc}
// const result = await createTransaction(9.5, 31.99);
// console.log(result);