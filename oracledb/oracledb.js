
import { existsSync } from 'fs';
import oracledb from 'oracledb';

console.log(process.platform);
let libPath;
if (process.platform === 'win32') {           // Windows
  libPath = 'C:\\oracle\\instantclient_19_12';
} else if (process.platform === 'darwin') {   // macOS
  libPath = process.env.HOME + '/Downloads/instantclient_19_8';
}
if (libPath && existsSync(libPath)) {
  oracledb.initOracleClient({ libDir: libPath });
}

async function run() {

  let connection;

  try {
    // Get a non-pooled connection
    connection = await oracledb.getConnection( {
      user    : "username",
      password : "Password",
      connectString : "158.101.103.144/3306"
    });

    console.log('Connection was successful!');

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();