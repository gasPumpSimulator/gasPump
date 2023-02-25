import { Client } from 'ssh2';
import express, { json } from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { getTransactions, getTransaction, createTransaction } from './database.js';

const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(express.json());










console.log(process.env.SSH_privatekey);



const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.shell((err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('Stream :: close');
      conn.end();
    }).on('data', (data) => {
      console.log('OUTPUT: ' + data);
    });
    stream.end('ls -l\nexit\n');
  });
}).connect({
    host: '158.101.103.144',
    username: 'opc',
    privateKey: process.env.SSH_privatekey,
});