// const express = require('express');
// require('dotenv').config();
// const multer = require('multer');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const path = require('path');
// const otpGenerator = require('otp-generator');
// const { Resend } = require('resend');
// const cookieParser = require('cookie-parser');

// const app = express();
// const PORT = process.env.PORT || 5000;


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const currentTime = new Date().getTime();
//     const filename = `${currentTime}_${file.originalname}`;
//     cb(null, filename);
//   }
// });
// const upload = multer({ storage: storage });


// app.use(express.json());
// app.use(cors());
// app.use(cookieParser());


// const sql = postgres({
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   username: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   port: 5432,
//   ssl: 'require',
//   connection: {
//     options: `project=${process.env.ENDPOINT_ID}`,
//   },
// });


// function generateAccessToken(username) {
//   return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
// }


// function authenticateToken(req, res, next) {
//   const token = req.cookies.token;
//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// // Routes
// app.get('/', async (req, res) => {
//   try {
//     const courses = await sql`SELECT * FROM Course`;
//     res.json(courses);
//   } catch (error) {
//     console.error('Error fetching courses:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/student/register', upload.single('profile'), async (req, res) => {
//   try {
//     const { name, email, contact, password } = req.body;
//     const profile = req.file;

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const existingEmail = await sql`SELECT email FROM Students WHERE email = ${email}`;

//     if (existingEmail.length > 0) {
//       return res.status(409).json({ message: 'User already exists, please go to login' });
//     }

//     const maxStudentId = await sql`SELECT MAX(student_id) FROM Students`;
//     const nextStudentId = (maxStudentId[0].max || 0) + 1;

//     await sql`INSERT INTO Students (student_id, name, email, contact, student_password, imgName)
//               VALUES (${nextStudentId}, ${name}, ${email}, ${contact}, ${hashedPassword}, ${profile.filename})`;

//     res.status(200).json({ message: 'Registration successful' });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/admin/register', async (req, res) => {
//   try {
//     const { name, email, contact, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const existingEmail = await sql`SELECT admin_email FROM provider WHERE admin_email = ${email}`;

//     if (existingEmail.length > 0) {
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     const maxAdminId = await sql`SELECT MAX(admin_id) FROM provider`;
//     const nextAdminId = (maxAdminId[0].max || 0) + 1;

//     await sql`INSERT INTO provider (admin_id, admin_name, admin_number, admin_email, admin_password)
//               VALUES (${nextAdminId}, ${name}, ${contact}, ${email}, ${hashedPassword})`;

//     res.status(200).json({ message: 'Admin registration successful' });
//   } catch (error) {
//     console.error('Error during admin registration:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/admin/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const result = await sql`SELECT admin_password FROM provider WHERE admin_email = ${email}`;

//     if (result.length === 0) {
//       return res.status(409).json({ message: 'Invalid credentials' });
//     }

//     const match = await bcrypt.compare(password, result[0].admin_password);
//     if (match) {
//       const token = generateAccessToken({ email: email });
//       res.cookie('token', token, { httpOnly: true });
//       res.json({ token: token });
//     } else {
//       res.status(401).json({ message: 'Invalid Password' });
//     }
//   } catch (error) {
//     console.error('Error during admin login:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/student/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const result = await sql`SELECT student_password, student_id FROM Students WHERE email = ${email}`;

//     if (result.length === 0) {
//       return res.status(409).json({ message: 'Invalid credentials' });
//     }

//     const match = await bcrypt.compare(password, result[0].student_password);
//     if (match) {
//       const token = generateAccessToken({ email: email });
//       res.cookie('token', token, { httpOnly: true });
//       res.json({ token: token, data: result });
//     } else {
//       res.status(401).json({ message: 'Invalid Password' });
//     }
//   } catch (error) {
//     console.error('Error during student login:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/addCourses', authenticateToken, upload.single('thumbnail'), async (req, res) => {
//   try {
//     const { course_name, category, description } = req.body;
//     const thumbnail = req.file;

//     const maxCourseId = await sql`SELECT MAX(course_id) FROM Course`;
//     const nextCourseId = (maxCourseId[0].max || 0) + 1;

//     await sql`INSERT INTO Course (course_id, course_name, category, thumbnail, description)
//               VALUES (${nextCourseId}, ${course_name}, ${category}, ${thumbnail.filename}, ${description})`;

//     res.status(200).json({ message: 'Course added successfully' });
//   } catch (error) {
//     console.error('Error adding course:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/student/profile', authenticateToken, async (req, res) => {
//   try {
//     const id = req.user.email;
//     const studentInfo = await sql`SELECT * FROM Students WHERE email = ${id}`;
//     const courses = await sql`SELECT * FROM Course WHERE student_id = ${studentInfo[0].student_id}`;

//     res.status(200).json({ data: studentInfo, courses: courses });
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/enroll', authenticateToken, async (req, res) => {
//   try {
//     const { course_id } = req.body;
//     const student_id = req.user.email;

//     const check = await sql`SELECT student_id FROM Course WHERE course_id = ${course_id}`;
//     if (check.length > 0 && check[0].student_id === student_id) {
//       return res.status(200).json({ message: 'Already Enrolled' });
//     }

//     await sql`UPDATE Course SET student_id = ${student_id} WHERE course_id = ${course_id}`;
//     res.status(200).json({ message: 'Enrolled successfully!!' });
//   } catch (error) {
//     console.error('Error during enrollment:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/unenroll', authenticateToken, async (req, res) => {
//   try {
//     const { course_id } = req.body;
//     const student_id = req.user.email;

//     // Check if the course exists and the student is enrolled
//     const check = await sql`SELECT student_id FROM Course WHERE course_id = ${course_id}`;
//     if (check.length === 0 || check[0].student_id !== student_id) {
//       return res.status(400).json({ message: 'You are not enrolled in this course' });
//     }

//     await sql`UPDATE Course SET student_id = NULL WHERE course_id = ${course_id}`;
//     res.status(200).json({ message: 'Unenrolled successfully!!' });
//   } catch (error) {
//     console.error('Error during unenrollment:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// app.post('/edit/student_profile', authenticateToken, async (req, res) => {
//   try {
//     const { name, email, contact } = req.body;
//     const student_id = req.user.email;

//     const result = await sql`
//       UPDATE Students
//       SET name = ${name}, email = ${email}, contact = ${contact}
//       WHERE student_id = ${student_id}`;

//     if (result.count > 0) {
//       res.status(200).json({ message: 'Profile updated successfully' });
//     } else {
//       res.status(400).json({ message: 'Failed to update profile' });
//     }
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// app.post('/', async (req, res) => {
//   try {
//     const { category } = req.body;
//     const courses = await sql`SELECT * FROM Course WHERE category = ${category}`;
//     res.json(courses);
//   } catch (error) {
//     console.error('Error retrieving courses:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// const resend = new Resend(process.env.API);
// app.get('/sendotp', async (req, res) => {
//   try {
//     const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
//     const { data, error } = await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: ["mdtauheed9682@gmail.com"],
//       subject: "hello world",
//       html: `<strong>${otp}</strong>`,
//     });

//     if (data) {
//       res.status(200).json({ message: "OTP sent successfully", otp: otp });
//     } else {
//       res.status(400).json({ error, message: "Error sending OTP" });
//     }
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Routes
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
