/*
File name: mysql.js
Author: Matthew Lancaster
Date last updated: 2/21/23
Purpose: A node.js file that connects to a MySQL HeatWave database on Oracle Cloud.
*/

const mysql = require('mysql');

const Connection = mysql.createConnection({
  host: 'localhost', // database server host
  user: 'username', // database username
  password: 'password', // database password
  database: 'database_name' // name of the database you want to connect to
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }

  console.log('Connected to database with ID ' + connection.threadId);
});

module.exports = {
    Connection: Connection
};
// Once connected, you can perform various database operations