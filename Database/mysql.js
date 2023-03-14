/*
File name: mysql.js
Author: Matthew Lancaster
Date last updated: 2/22/23
Purpose: A node.js file that connects to a MySQL HeatWave database on Oracle Cloud. 
Uses the node.js mysql package to create a connection to the database service, create a fuel pump table, and querying said table.

FuelPump: The name of the SQL table that will be used in the database.
Attributes: 
     - TransactionId: Saves the unique ID of each transaction at a fuel pump. REQUIRED
     - FuelType: Saves the name of the fuel type (e.g. Regular, Unleaded, Premium, Diesel). REQUIRED
     - PumpedFuel: Saves the total amount of fuel pumped for one transaction. REQUIRED
     - FuelCost: Saves the total cost of the fuel that is pumped per transaction. REQUIRED
     - TransactionTime: Saves the date and time of the transaction. REQUIRED

//SQL Model:

CREATE DATABASE gasPump;

USE gasPump;

-- Table for storing information about the fuel pump transactions
CREATE TABLE FuelPump (
    TransactionId INT PRIMARY KEY,
    FuelType VARCHAR(50) NOT NULL,
    PumpedFuel DECIMAL(10,2) NOT NULL,
    FuelCost DECIMAL(10,2) NOT NULL,
    TransactionTime DATETIME NOT NULL
);
*/

const mysql = require('mysql');
//Connect to database server host
const connection = mysql.createConnection({
  host: 'localhost', // database server host
  user: 'username', // database username
  password: 'password', // database password
  database: 'database_name' // name of the database you want to connect to
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL server');
    //SQL MODEL for table FuelPump
    const sql = `CREATE TABLE FuelPump (
                 TransactionId INT NOT NULL AUTO_INCREMENT,
                 FuelType VARCHAR(50) NOT NULL,
                 PumpedFuel DECIMAL(10,2) NOT NULL,
                 FuelCost DECIMAL(10,2) NOT NULL,
                 TransactionTime DATETIME NOT NULL,
                 PRIMARY KEY (TransactionId)
                )`;
    //Query table
    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log('Table created:', result);
      connection.end();
    });
  });