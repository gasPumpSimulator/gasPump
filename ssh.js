import { Client } from 'ssh2';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const connection = function(){};
connection.invokeQuery = function(sqlQuery, callback) {
	
	const ssh = new Client();
	ssh.connect({
		host: process.env.SSH_host,
    	username: process.env.SSH_user,
    	privateKey: process.env.SSH_privatekey,
	});
	ssh.on('ready', function() {
		ssh.forwardOut(
			'127.0.0.1',
			12345,
			process.env.MYSQL_HOST,
			3306,
			function(err, stream) {
				if (err) console.log("ssh error")
				
				const config = 
				{
					host: process.env.MYSQL_HOST,
					user: process.env.MYSQL_USER,
					password: process.env.MYSQL_PASSWORD,
					database: process.env.MYSQL_DATABASE,
					stream
				};
				const con = mysql.createConnection(config);
				con.connect(function(err) {
					if (err) {
						throw err;
					} else {
						console.log("Connected");
					}
					con.query(sqlQuery, function(err, rows) {
						if (err) {
							console.log('error with query');
						} else {
							callback(err, rows);
						}
					});
				con.end();
				});
			}
		);
	});
}
export default connection;

