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
      const [rows] = await connection.execute(`
        SELECT
          course.*,
          GROUP_CONCAT(tag) AS tags,
          AVG(stuCourseXRef.r1) AS r1,
          AVG(stuCourseXRef.r2) AS r2,
          (
            SELECT r3
            FROM stuCourseXRef
            WHERE course.course_id = stuCourseXRef.course_id
            GROUP BY r3
            ORDER BY COUNT(*) DESC
            LIMIT 1
          ) AS r3
        FROM course
        LEFT JOIN tagCourseXRef ON course.course_id = tagCourseXRef.course_id
        LEFT JOIN stuCourseXRef ON course.course_id = stuCourseXRef.course_id
        GROUP BY course.course_id
      `);

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
  const { studentId, courseName, difficultyRating, interestRating, teachingStyle } = req.body;

  try {
    const connection = await createConnection();

    try {
      // Fetch existing ratings from the database
      const selectQuery = `
        SELECT r1, r2, r3
        FROM stuCourseXRef
        WHERE stu_id = ?
          AND course_id = (SELECT course_id FROM course WHERE course_name = ?)
      `;

      const selectValues = [studentId, courseName];

      const [selectResult] = await connection.execute(selectQuery, selectValues);

      // Calculate the average of existing and new ratings
      const existingR1 = selectResult[0].r1 || 0;
      const existingR2 = selectResult[0].r2 || 0;
      const existingR3 = selectResult[0].r3 || 0;

      const averageRating = (existingR1 + existingR2 + existingR3 + difficultyRating + interestRating + teachingStyle) / 6;

      // Update the ratings in the database
      const updateQuery = `
        UPDATE stuCourseXRef
        SET r1 = ?,
            r2 = ?,
            r3 = ?,
            average_rating = ?
        WHERE stu_id = ?
          AND course_id = (SELECT course_id FROM course WHERE course_name = ?)
      `;

      const updateValues = [difficultyRating, interestRating, teachingStyle, averageRating, studentId, courseName];

      const [updateResult] = await connection.execute(updateQuery, updateValues);

      if (updateResult.affectedRows > 0) {
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
app.post('/api/addStudentCourse', async (req, res) => {
  const { studentId, courseName, teacherId, r1, r2, r3, active, description, prereq } = req.body;

  try {
    const connection = await createConnection();

    try {
      // Check if the student already has the course
      const [existingCourse] = await connection.execute(`
        SELECT * FROM stuCourseXRef
        WHERE stu_id = ? AND course_name = ?
      `, [studentId, courseName]);

      if (existingCourse.length > 0) {
        return res.status(400).json({ error: 'Student already has the course' });
      }

      const courseId = Math.floor(Math.random() * 1000000);

      // Throw an error if courseId is null
      if (!courseId) {
        throw new Error('Error generating course ID');
      }

      // Insert the course with the provided courseId
      try {
        await connection.execute(`
          INSERT INTO course (course_id, course_name, teacher_id, r1, r2, r3, active, description, prereq)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [courseId, courseName, teacherId, r1, r2, r3, active, description, prereq]);
      } catch (error) {
        console.error('Error inserting course:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Insert the course into stuCourseXRef
      await connection.execute(`
        INSERT INTO stuCourseXRef (stu_id, course_id) VALUES (?, ?)
      `, [studentId, courseId]);

      res.json({ success: true });
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error adding student course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/students', async (req, res) => {
  const { stu_name_first, stu_name_last, stu_email, stu_pass, stu_academy, stu_grade } = req.body;

  // Ensure stu_grade is parsed as an integer
  const parsedGrade = parseInt(stu_grade, 10);
  
  try {
    const connection = await createConnection();
  
    try {
      const insertQuery = `
        INSERT INTO student (stu_name_first, stu_name_last, stu_email, stu_pass, stu_academy, stu_grade)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
  
      const values = [stu_name_first, stu_name_last, stu_email, stu_pass, stu_academy, parsedGrade];
  
      const [result] = await connection.execute(insertQuery, values);
  
      if (result.affectedRows > 0) {
        console.log('Student registration successful');
        res.status(201).json({ message: 'Student registration successful' });
      } else {
        res.status(500).json({ error: 'Failed to register student' });
      }
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  });


app.post('/api/getCourseTags', async (req, res) => {
  const { courseIds } = req.body;

  try {
    const connection = await createConnection();

    try {
      const [rows] = await connection.query(`
        SELECT course_id, tag_name
        FROM tagCourseXRef
        WHERE course_id IN (?)
      `, [courseIds]);

      res.json(rows);
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error fetching course tags:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/recs', async (req, res) => {
  const { studentId } = req.query;

  try {
    const connection = await createConnection();

    try {
      const [averageRatings] = await connection.execute(`
        SELECT
          scxr.course_id,
          AVG(scxr.r1) AS avg_r1,
          AVG(scxr.r2) AS avg_r2
        FROM
          stuCourseXRef scxr
          LEFT JOIN student s ON scxr.stu_id = s.stu_id
        WHERE
          s.stu_academy = (SELECT stu_academy FROM student WHERE stu_id = ?)
        GROUP BY
          scxr.course_id;
      `, [studentId]);

      console.log('Average Ratings of Same Academy:', averageRatings);

      const [preferredTags] = await connection.execute(`
        SELECT c.tag, AVG(scr.r1 + scr.r2) AS avg_rating
        FROM tagCourseXRef c
        JOIN stuCourseXRef scr ON c.course_id = scr.course_id
        WHERE c.course_id IN (SELECT course_id FROM stuCourseXRef WHERE stu_id = ?)
          AND scr.stu_id = ?
        GROUP BY c.tag
        ORDER BY avg_rating DESC
        LIMIT 5;
      `, [studentId, studentId]);

      console.log('Preferred Tags:', preferredTags);

      const [recommendedCourses] = await connection.execute(`
        SELECT
          avgRatings.course_id,
          avgRatings.avg_r1,
          avgRatings.avg_r2,
          COALESCE(prereqStatus.taken, 0) AS prerequisite_taken,
          COALESCE(course.active, 0) AS course_active
        FROM
          (SELECT
            scxr.course_id,
            AVG(scxr.r1) AS avg_r1,
            AVG(scxr.r2) AS avg_r2
          FROM
            stuCourseXRef scxr
            LEFT JOIN student s ON scxr.stu_id = s.stu_id
          WHERE
            s.stu_academy = (SELECT stu_academy FROM student WHERE stu_id = ?)
          GROUP BY
            scxr.course_id) AS avgRatings
        LEFT JOIN
          (SELECT
            pc.course_id,
            1 AS taken
          FROM
            stuCourseXRef pc
          WHERE
            pc.stu_id = ?
            AND pc.course_id IN (SELECT course_id FROM stuCourseXRef WHERE stu_id = ?)) AS prereqStatus
        ON avgRatings.course_id = prereqStatus.course_id
        LEFT JOIN
          course
        ON avgRatings.course_id = course.course_id
        WHERE
          COALESCE(prereqStatus.taken, 0) = 0 -- Exclude courses already taken
          AND COALESCE(course.active, 0) = 1 -- Include only active courses
        ORDER BY
          (avgRatings.avg_r1 + avgRatings.avg_r2) DESC
        LIMIT 5;
      `, [studentId, studentId, studentId]);

      console.log('Recommended Courses:', recommendedCourses);
      const detailedRecommendations = await Promise.all(recommendedCourses.map(async (course) => {
        const [courseDetails] = await connection.execute(`
          SELECT course.*, GROUP_CONCAT(tag) AS tags
          FROM course
          LEFT JOIN tagCourseXRef ON course.course_id = tagCourseXRef.course_id
          WHERE course.course_id = ?
          GROUP BY course.course_id
        `, [course.course_id]);

        return { ...course, ...courseDetails[0] };
      }));

      console.log('Detailed Recommendations:', detailedRecommendations);
      res.json(detailedRecommendations);
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/deleteCourse', async (req, res) => {
  const { courseId } = req.query;

  try {
    const connection = await createConnection();

    try {
      const [existingCourse] = await connection.execute('SELECT * FROM course WHERE course_id = ?', [courseId]);

      if (existingCourse.length === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }

      await connection.execute('DELETE FROM course WHERE course_id = ?', [courseId]);

      await connection.execute('DELETE FROM stuCourseXRef WHERE course_id = ?', [courseId]);

      res.json({ success: true });
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.get('/api/getCourseDetails', async (req, res) => {
//   try {
//     const { courseId } = req.query;

//     if (!courseId) {
//       return res.status(400).json({ error: 'Missing courseId parameter' });
//     }

//     const connection = await createConnection();

//     try {
//       const [rows] = await connection.execute(`
//         SELECT course.*, GROUP_CONCAT(tag) AS tags
//         FROM course
//         LEFT JOIN tagCourseXRef ON course.course_id = tagCourseXRef.course_id
//         WHERE course.course_id = ?
//         GROUP BY course.course_id
//       `, [courseId]);

//       if (rows.length === 0) {
//         return res.status(404).json({ error: 'Course not found' });
//       }

//       console.log(rows);
//       res.json(rows[0]); // Assuming you want to return details for a single course
//     } finally {
//       connection.end();
//     }
//   } catch (error) {
//     console.error('Error fetching course details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});