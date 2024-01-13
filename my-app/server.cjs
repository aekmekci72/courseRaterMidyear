const express = require('express');
const cors = require('cors');
const { createConnection } = require('./src/lib/db/mysql.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

console.log('Server file executed.');

app.get('/api/courses', async (req, res) => {
  try {
    const connection = await createConnection();

    try {
      const [rows] = await connection.execute('SELECT * FROM course');
      console.log(rows);
      res.json(rows);
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
