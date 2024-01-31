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
        AND c.active = 1
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
      
      const updateQuery = `
        UPDATE stuCourseXRef
        SET r1 = ?,
            r2 = ?,
            r3 = ?
        WHERE stu_id = ?
          AND course_id = (SELECT course_id FROM course WHERE course_name = ?)
      `;

      const updateValues = [difficultyRating, interestRating, teachingStyle, studentId, courseName];

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
  const { studentId, courseName, teacherId, r1, r2, r3, active, description, prereq, tags } = req.body;

  try {
    const connection = await createConnection();

    try {
      // Check if the student already has the course
      const [existingCourse] = await connection.execute(`
        SELECT * FROM stuCourseXRef
        WHERE stu_id = ? AND course_id=(SELECT course_id FROM course WHERE course_name = ?)
      `, [studentId, courseName]);

      if (existingCourse.length > 0) {
        return res.status(400).json({ error: 'Student already has the course' });
      }

      // Insert the course with the provided courseId
      let courseId;
      try {
        const [result] = await connection.execute(`
          INSERT INTO course (course_name, teacher_id, active, description, prereq)
          VALUES (?, ?, ?, ?, ?)`, [courseName, teacherId, active, description, prereq]);

        courseId = result.insertId;
      } catch (error) {
        console.error('Error inserting course:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Insert the course into stuCourseXRef
      if (!r3) {
        r3 = 'N/A';
      }

      await connection.execute(`
        INSERT INTO stuCourseXRef (stu_id, course_id, r1, r2, r3) VALUES (?, ?, ?, ?, ?)
      `, [studentId, courseId, r1, r2, r3]);

      if (tags && tags.length > 0) {
        for (const tag of tags) {
          await connection.execute(`
            INSERT INTO tagCourseXRef (course_id, tag) VALUES (?, ?)
          `, [courseId, tag]);
        }
      }

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

  app.post('/api/updateCourse', async (req, res) => {
    const { courseId, courseName, active, description, prereq } = req.body;
    try {
      const connection = await createConnection();
  
      try {
        
        const updateQuery = `
          UPDATE course
          SET course_name = ?, active = ?, description = ?, prereq = ?
          WHERE course_id = ?
        `;
  
        const updateValues = [courseName, active, description, prereq, courseId];
  
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
  c.course_id,
  COALESCE(AVG(IFNULL(scxr.r1, 0)), 0) AS avg_r1,
  COALESCE(AVG(IFNULL(scxr.r2, 0)), 0) AS avg_r2
FROM
  course c
  LEFT JOIN stuCourseXRef scxr ON c.course_id = scxr.course_id
  LEFT JOIN student s ON scxr.stu_id = s.stu_id AND s.stu_academy = (SELECT stu_academy FROM student WHERE stu_id = ?)
WHERE
      s.stu_id != ? AND s.stu_academy = (SELECT stu_academy FROM student WHERE stu_id = ?)
  GROUP BY
  c.course_id;



      `, [studentId, studentId, studentId]);


      const [averagetotalRatings] = await connection.execute(`
      SELECT
  c.course_id,
  COALESCE(AVG(IFNULL(scxr.r1, 0)), 0) AS avg_r1,
  COALESCE(AVG(IFNULL(scxr.r2, 0)), 0) AS avg_r2
FROM
  course c
  LEFT JOIN stuCourseXRef scxr ON c.course_id = scxr.course_id
  LEFT JOIN student s ON scxr.stu_id = s.stu_id AND s.stu_academy = (SELECT stu_academy FROM student WHERE stu_id = ?)
GROUP BY
  c.course_id;



      `, [studentId, studentId]);


      console.log('Average Ratings of Same Academy:', averageRatings);

      const [preferredTags] = await connection.execute(`
      SELECT c.course_id, c.tag, AVG(scr.r1 + scr.r2) AS avg_rating
      FROM tagCourseXRef c
      JOIN stuCourseXRef scr ON c.course_id = scr.course_id
      WHERE c.course_id IN (SELECT course_id FROM stuCourseXRef WHERE stu_id = ?)
        AND scr.stu_id = ?
      GROUP BY c.course_id, c.tag
      ORDER BY avg_rating DESC
      LIMIT 5;
      
      `, [studentId, studentId]);

      console.log('Preferred Tags:', preferredTags);

      const [recommendedCourses] = await connection.execute(`
        SELECT
          course.course_id,
          course.course_name,
          course.teacher_id,
          AVG(IFNULL(stuCourseXRef.r1, 0)) AS r1,
          AVG(IFNULL(stuCourseXRef.r2, 0)) AS r2,
          (
            SELECT r3
            FROM stuCourseXRef
            WHERE course.course_id = stuCourseXRef.course_id
            GROUP BY r3
            ORDER BY COUNT(*) DESC
            LIMIT 1
          ) AS avg_r3,
          course.active,
          course.description,
          course.prereq,
          GROUP_CONCAT(tagCourseXRef.tag) AS tags -- Include tags in the result set
        FROM
          course
          LEFT JOIN stuCourseXRef ON course.course_id = stuCourseXRef.course_id
          LEFT JOIN student ON stuCourseXRef.stu_id = student.stu_id
          LEFT JOIN tagCourseXRef ON course.course_id = tagCourseXRef.course_id
        WHERE
          student.stu_academy = (SELECT stu_academy FROM student WHERE stu_id = ?)
          AND (stuCourseXRef.stu_id IS NULL OR stuCourseXRef.stu_id != ?) -- Exclude courses the student is already taking
        GROUP BY
          course.course_id
        ORDER BY
          (r1 + r2) DESC
        LIMIT 5;
      `, [studentId, studentId]);

      const detailedRecommendations = await Promise.all(recommendedCourses.map(async (course) => {
        const [courseDetails] = await connection.execute(`
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
          WHERE course.course_id = ?
          GROUP BY course.course_id;
        `, [course.course_id]);

        const academyAvg = ((averageRatings.find(avg => avg.course_id === course.course_id) || {}).avg_r2 + (averageRatings.find(avg => avg.course_id === course.course_id) || {}).avg_r1) / 2;
        const totalAvg = ((averagetotalRatings.find(avg => avg.course_id === course.course_id) || {}).avg_r2 + (averagetotalRatings.find(avg => avg.course_id === course.course_id) || {}).avg_r1) / 2;

        const courseTags = course.tags ? course.tags.split(',') : [];
        let preferredTagRatings = 0;

        for (const tag of courseTags) {
          const matchingTag = preferredTags.find(preferredTag => preferredTag.tag === tag);
          if (matchingTag) {
            preferredTagRatings += matchingTag.avg_rating;
          }
        }

        const totalScore = academyAvg + totalAvg + preferredTagRatings;

        return { ...course, ...courseDetails[0], academyAvg, totalAvg, preferredTagRatings, totalScore };
      }));

      const sortedRecommendations = detailedRecommendations.sort((a, b) => b.totalScore - a.totalScore);
      console.log(sortedRecommendations);
      res.json(sortedRecommendations);

    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/deleteCourse', async (req, res) => {
  const { courseId, studentId } = req.query;

  try {
    const connection = await createConnection();

    try {

      await connection.execute('DELETE FROM stuCourseXRef WHERE course_id = ? AND stu_id = ?', [courseId, studentId]);


      res.json({ success: true });
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getCourseDetails', async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ error: 'Missing courseId parameter' });
    }

    const connection = await createConnection();

    try {
      const [rows] = await connection.execute(`
        SELECT course.*, GROUP_CONCAT(tag) AS tags
        FROM course
        LEFT JOIN tagCourseXRef ON course.course_id = tagCourseXRef.course_id
        WHERE course.course_id = ?
        GROUP BY course.course_id
      `, [courseId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }

      console.log(rows);
      res.json(rows[0]); // Assuming you want to return details for a single course
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/getPastStudentCourses', async (req, res) => {
  const { studentId } = req.query;

  try {
    const connection = await createConnection();

    try {
      const [rows] = await connection.execute(`
      SELECT
        scxr.course_id,
        c.course_name,
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
        AND c.active = 0
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


app.post('/api/getCourseRatingsPercentage', async (req, res) => {
  const { courseName, studentId } = req.body;

  try {
    const connection = await createConnection();

    try {
      const [totalPercentageResult] = await connection.execute(`
        SELECT
          COUNT(*) AS totalStudents,
          COUNT(CASE WHEN r1 >= 3 THEN 1 END) AS studentsRatedR1,
          COUNT(CASE WHEN r2 >= 3 THEN 1 END) AS studentsRatedR2
        FROM stuCourseXRef
        WHERE course_id = (SELECT course_id FROM course WHERE course_name = ?)
      `, [courseName]);

      const totalStudents = totalPercentageResult[0].totalStudents;
      const studentsRatedR1 = totalPercentageResult[0].studentsRatedR1;
      const studentsRatedR2 = totalPercentageResult[0].studentsRatedR2;

      const percentageR1 = (studentsRatedR1 / totalStudents) * 100;
      const percentageR2 = (studentsRatedR2 / totalStudents) * 100;

      const [academyPercentageResult] = await connection.execute(`
        SELECT
          COUNT(*) AS academyStudents,
          COUNT(CASE WHEN r1 >= 3 THEN 1 END) AS academyStudentsRatedR1,
          COUNT(CASE WHEN r2 >= 3 THEN 1 END) AS academyStudentsRatedR2
        FROM stuCourseXRef
        WHERE course_id = (SELECT course_id FROM course WHERE course_name = ?)
          AND stu_id != ?
          AND stu_id IN (SELECT stu_id FROM student WHERE stu_academy = (SELECT stu_academy FROM student WHERE stu_id = ?))
      `, [courseName, studentId, studentId]);

      const academyStudents = academyPercentageResult[0].academyStudents;
      const academyStudentsRatedR1 = academyPercentageResult[0].academyStudentsRatedR1;
      const academyStudentsRatedR2 = academyPercentageResult[0].academyStudentsRatedR2;

      const academyPercentageR1 = (academyStudentsRatedR1 / academyStudents) * 100;
      const academyPercentageR2 = (academyStudentsRatedR2 / academyStudents) * 100;

      res.json({
        percentageR1: percentageR1.toFixed(2),
        percentageR2: percentageR2.toFixed(2),
        academyPercentageR1: academyPercentageR1.toFixed(2),
        academyPercentageR2: academyPercentageR2.toFixed(2),
      });
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error fetching course ratings percentage:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});








app.post('/api/coursestudentadd', async (req, res) => {
  const { studentId, courseId } = req.body;
  console.log(studentId,courseId);
      
  try {
    const connection = await createConnection();
      
    try {
      
      await connection.execute('INSERT INTO stuCourseXRef (stu_id, course_id) VALUES (?, ?)', [studentId, courseId]);
      
      
      res.json({ success: true });
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});