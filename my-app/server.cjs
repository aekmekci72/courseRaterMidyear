// server.js (or your server file)

import express from 'express';
import cors from 'cors';
import pkg from './mysql.cjs';

const { createConnection } = pkg;

const app = express();
const port = 3000; // Set your desired port

app.use(cors());

const testDatabaseConnection = async () => {
  try {
    const connection = await createConnection();

    const [rows] = await connection.execute('SELECT * FROM courses');

    await connection.end();

    return rows;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await testDatabaseConnection();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
