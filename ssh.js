import { Client } from 'ssh2';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

let connection = function(){};
/*
function createDBConnection() {
	let mysqlConnection = mysql.createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
	});
	return mysqlConnection;
};*/


	const ssh = new Client();
	ssh.connect({
		host: '158.101.103.144',
    	username: 'opc',
    	privateKey: process.env.SSH_privatekey,
	});

	ssh.on('ready', function() {
		ssh.forwardOut(
			'127.0.0.1', // any valid address
			12345, // any valid port
			'10.11.10.77', // destination database
			3306, // destination port
			function(err, stream) {
				if (err) console.log('ssh 1 error')
				
				let  config = 
				{
					host: process.env.MYSQL_HOST,
					user: process.env.MYSQL_USER,
					password: process.env.MYSQL_PASSWORD,
					database: process.env.MYSQL_DATABASE,
					stream
				};

				let con = mysql.createConnection(config);
				con.connect(function(err) {
					if (err) throw err;
					else
					console.log("Connected!");
					con.query("Select * from transactions", function(err, rows) {
						if (err) console.log('error2');
						else
						console.log(rows);
					});
				  });
				/*
				db.query("Select * from Transactions", function(err, rows){
					if(rows) {
						console.log(rows);
						data(rows);
					}
					if(err) { handleMySQLError(err)}
				})*/
			}
		);
	});









/*
const forwardConfig = {
    srcHost: '127.0.0.1', // any valid address
    srcPort: 3306, // any valid port
    dstHost: '10.11.10.77', // destination database
    dstPort: 3306 // destination port
};
const sshClient = new Client();
const SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
		sshClient.forwardOut(
		'158.101.103.144',
		'opc',
		process.env.SSH_privatekey,
        (err, stream) => {
             if (err) reject(err);
           
            // create a new DB server object including stream
            const updatedDbServer = {
                 ...dbServer,
                 stream
            };
            // connect to mysql
            const connection =  mysql.createConnection(updatedDbServer);
            // check for successful connection
           //  resolve or reject the Promise accordingly          
           connection.connect((error) => {
            if (error) {
				console.log('error test');
                reject(error);
            }
			else {
				console.log('success')
			}
            resolve(connection);
            });
       });
}).connect({
	host: '158.101.103.144',
    username: 'opc',
    privateKey: process.env.SSH_privatekey,
});
});


create new client
const sshConnection = new Client();

sshConnection.on('ready', () => {
  console.log('Client :: ready');
  sshConnection.shell((err, stream) => {
    if (err) throw err;

	//closing stream
    stream.on('close', () => {
      console.log('Stream :: close');
      sshConnection.end();
	
    }).on('data', (data) => {
      console.log('data entered: ' + data);
    });
    stream.end('ls -l\nexit\n');


  });
}).connect({
    host: '158.101.103.144',
    username: 'opc',
    privateKey: process.env.SSH_privatekey,
});
*/


