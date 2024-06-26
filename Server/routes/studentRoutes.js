const express = require('express');
const multer = require('multer');
const { register, profile, editProfile } = require('../controllers/studentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const currentTime = new Date().getTime();
        cb(null, `${currentTime}_${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/register', upload.single('profile'), register);
router.post('/profile', authenticateToken, profile);
router.post('/editProfile', editProfile)

module.exports = router;
