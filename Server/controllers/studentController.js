const bcrypt = require('bcrypt');
const { addStudent, getStudentByEmail, sql } = require('../models/studentModel');
const postgres = require('postgres');

exports.register = async (req, res) => {
    try {
        const { name, email, contact, password } = req.body;
        const profile = req.file;

        const hashedPassword = await bcrypt.hash(password, 10);
        const existingEmail = await getStudentByEmail(email);

        if (existingEmail.length > 0) {
            return res.status(409).json({ message: 'User already exista' });
        }

        const maxStudentId = await sql`SELECT MAX(student_id) FROM Students`;
        const nextStudentId = (maxStudentId[0].max || 0) + 1;

        await addStudent({
            student_id: nextStudentId,
            name,
            email,
            contact,
            student_password: hashedPassword,
            imgname: profile.filename,
        });
        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.profile = async (req, res) => {
    try {
        const id = req.user.email;
        const studentInfo = await sql`SELECT * FROM Students WHERE email = ${id}`;
        const courses = await sql`SELECT * FROM Course WHERE student_id = ${studentInfo[0].student_id}`;
        console.log(courses);
        res.status(200).json({ data: studentInfo, courses: courses });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.editProfile = async (req, res) => {
    try {
        const { name, email, contact } = req.body;
        const student_id = req.user.email;
        const result = await sql`
              UPDATE Students
              SET name = ${name}, email = ${email}, contact = ${contact}
              WHERE student_id = ${student_id}`;
        if (result.count > 0) {
            res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update profile' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}