import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getTransactions() {
    const [rows] = await pool.query("SELECT * FROM FuelTransactions")
    return rows;
}

export async function getTransaction(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM FuelTransactions
    WHERE TransactionId = ${id}
    `);
    return rows[0];
}

export async function createTransaction(TransactionId, FuelPumpID, PumpedFuel, PumpedAmount) {
    const result = await pool.query(`
    INSERT INTO FuelTransactions (TransactionId, FuelPumpID, PumpedFuel, PumpedAmount)
    VALUES (?, ?, ?, ?)
    `, [TransactionId, FuelPumpID, PumpedFuel, PumpedAmount]);
    return result;
}

// const transactions = await getTransactions(1);
// console.log(transactions);

// const result = await createTransaction(5, 12, 9, 9);
// console.log(result);