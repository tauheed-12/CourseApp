const express = require('express');
const { adminLogin, studentLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/student/login', studentLogin);

module.exports = router;
