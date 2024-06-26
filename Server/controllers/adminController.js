const bcrypt = require('bcrypt');
const { addAdmin, getAdminByEmail, sql } = require('../models/adminModel');

exports.register = async (req, res) => {
    try {
        const { name, email, contact, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingEmail = await getAdminByEmail(email);

        if (existingEmail.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const maxAdminId = await sql`SELECT MAX(admin_id) FROM provider`;
        const nextAdminId = (maxAdminId[0].max || 0) + 1;

        await addAdmin({
            admin_id: nextAdminId,
            admin_name: name,
            admin_number: contact,
            admin_email: email,
            admin_password: hashedPassword,
        });

        res.status(200).json({ message: 'Admin registration successful' });
    } catch (error) {
        console.error('Error during admin registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
