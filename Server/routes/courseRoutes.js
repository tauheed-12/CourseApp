const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { sql, filterCourse, getCourses, addCourse, enroll, unenroll } = require('../controllers/courseController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const currentTime = new Date().getTime();
        cb(null, `${currentTime}_${file.originalname}`);
    },
});

const upload = multer({ storage });

router.get('/', getCourses);
router.post('/add', authenticateToken, upload.single('thumbnail'), addCourse);
router.post('/enroll', enroll);
router.post('/unenroll', unenroll);
router.post('/', filterCourse);
module.exports = router;
