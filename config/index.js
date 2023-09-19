
const connectionConfig = require('../config/database.js');
const mysql = require("mysql2");


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'sakila', 
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database");
});

module.exports = connection;
