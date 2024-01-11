import pkg from './mysql.cjs';

const { createConnection } = pkg;

const testDatabaseConnection = async () => {
  try {
    const connection = await createConnection();

    const [rows] = await connection.execute('SELECT * FROM courses');

    console.log('All Courses:', rows);

    await connection.end();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

testDatabaseConnection();
