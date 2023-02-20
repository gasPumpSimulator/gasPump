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
    const [rows] = await pool.query("SELECT * FROM transactions")
    return rows;
}

export async function getTransaction(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM transactions
    WHERE id = ${id}
    `);
    return rows[0];
}

export async function createTransaction(gallons, price) {
    const result = await pool.query(`
    INSERT INTO transactions (gallons, price)
    VALUES (?, ?)
    `, [gallons, price]);
    return result;
}

// const transactions = await getTransactions();
// console.log(transactions);

// const result = await createTransaction(9.5, 31.99);
// console.log(result);