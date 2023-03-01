//function call to get query results from database
import fs from 'fs';
import connectionQuery from './ssh.js';
//connection.invokeQuery("INSERT INTO transactions VALUES (23, 3,4 ,5);", (err, res) => {console.log(res)});
let returnedRows = await connectionQuery("SELECT * FROM transactions");

console.log(returnedRows);
    





