import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

import connectionQuery from './ssh.js';

export async function getTransactions() {
    const rows = await connectionQuery("SELECT * FROM transactions");
    return rows;
}

export async function getTransaction(id) {
    const rows = await connectionQuery(`SELECT * FROM transactions WHERE id = ${id}`);
    return rows;
}
export async function createTransaction(gallons, price) {
    const result = await connectionQuery(`INSERT INTO transactions (gallons, price, time) VALUES (${gallons}, ${price}, CURRENT_TIME)`);
    return result;
}

// const transactions = await getTransactions();
// console.log(transactions);

// const result = await createTransaction(9.5, 31.99);
// console.log(result);