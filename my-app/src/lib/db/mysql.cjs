const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000'),
    });

    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Error creating MySQL connection:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

module.exports = { createConnection };
