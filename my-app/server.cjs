const express = require('express');
const cors = require('cors');
const { createConnection } = require('./src/lib/db/mysql.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());


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

app.get('/api/students', async (req, res) => {
  try {
    const connection = await createConnection();

    try {
      const [rows] = await connection.execute('SELECT * FROM student');
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

app.get('/api/getStuNameById', async (req, res) => {
  const { studentId } = req.query;

  try {
    const connection = await createConnection();

    try {
      const [rows] = await connection.execute('SELECT stu_name_first, stu_name_last FROM student WHERE stu_id = ?', [studentId]);

      if (rows.length > 0) {
        const studentName = `${rows[0].stu_name_first} ${rows[0].stu_name_last}`;
        res.json({ studentName });
      } else {
        res.status(404).json({ error: 'Student not found' });
      }
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error fetching student name by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getStudentCourses', async (req, res) => {
  const { studentId } = req.query;

  try {
    const connection = await createConnection();

    try {
      const [rows] = await connection.execute(`
      SELECT
        scxr.course_id,
        c.course_name,
        c.teacher_id,
        scxr.r1,
        scxr.r2,
        scxr.r3,
        c.active,
        c.description,
        c.prereq
      FROM
        stuCourseXRef scxr
        INNER JOIN course c ON scxr.course_id = c.course_id
      WHERE
        scxr.stu_id = ?
    `, [studentId]);

      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(404).json({ error: 'Student not found' });
      }
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error fetching student name by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/updateRatings', async (req, res) => {

  const {studentId, courseName, difficultyRating, interestRating, teachingStyle } = req.body;

  try {
    const connection = await createConnection();

    try {
      const updateQuery = `
        UPDATE stuCourseXRef
        SET r1 = ?, r2 = ?, r3 = ?
        WHERE stu_id = ?
          AND course_id = (SELECT course_id FROM course WHERE course_name = ?)
      `;

      const values = [difficultyRating, interestRating, teachingStyle, studentId, courseName];

      const [result] = await connection.execute(updateQuery, values);

      if (result.affectedRows > 0) {
        console.log('Ratings updated successfully');
        res.status(200).json({ message: 'Ratings updated successfully' });
      } else {
        res.status(404).json({ error: 'Student or course not found' });
      }
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});