const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getAdminByEmail } = require('../models/adminModel')
const { getStudentByEmail } = require('../models/studentModel')

const generateAccessToken = (user) => jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const result = await getAdminByEmail(email);

    if (result.length === 0) {
        return res.status(409).json({ message: 'Invalid Ceredentials' });
    }

    const match = await bcrypt.compare(password, result[0].admin_password);
    if (match) {
        const token = generateAccessToken({ email });
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid Password' });
    }
};


exports.studentLogin = async (req, res) => {
    const { email, password } = req.body;
    const result = await getStudentByEmail(email);

    if (result.length == 0) {
        return res.status(409).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, result[0].student_password);
    if (match) {
        const token = generateAccessToken({ email });
        res.cookie('token', token, { httpOnly: true });
        res.json({ token, data: result });
    } else {
        res.status(401).json({ message: 'Invalid Password' });
    }
};