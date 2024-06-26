const { sql, getFilteredCourse, getAllCourses, addCourse, getCourseById, enrollStudentInCourse, unenrollStudentFromCourse } = require('../models/courseModel');

exports.getCourses = async (req, res) => {
    try {
        const courses = await getAllCourses();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addCourse = async (req, res) => {
    try {
        const { course_name, category, description } = req.body;
        const thumbnail = req.file;

        const maxCourseId = await sql`SELECT MAX(course_id) FROM Course`;
        const nextCourseId = (maxCourseId[0].max || 0) + 1;

        await addCourse({
            course_id: nextCourseId,
            course_name,
            category,
            thumbnail: thumbnail.filename,
            description,
        });

        res.status(200).json({ message: 'Course added successfully' });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.enroll = async (req, res) => {
    try {
        const { course_id, LoggedId } = req.body;
        console.log(course_id, LoggedId);
        const student_id = LoggedId;
        const course = await getCourseById(course_id);
        if (course.length > 0 && course[0].student_id === student_id) {
            return res.status(200).json({ message: 'Already Enrolled' });
        }

        await enrollStudentInCourse(course_id, student_id);
        res.status(200).json({ message: 'Enrolled successfully!!' });
    } catch (error) {
        console.error('Error during enrollment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unenroll = async (req, res) => {
    try {
        const { course_id, studentId } = req.body;
        const student_id = studentId;

        const course = await getCourseById(course_id);
        if (course.length === 0 || course[0].student_id !== student_id) {
            return res.status(400).json({ message: 'You are not enrolled in this course' });
        }

        await unenrollStudentFromCourse(course_id);
        res.status(200).json({ message: 'Unenrolled successfully!!' });
    } catch (error) {
        console.error('Error during unenrollment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.filterCourse = async (req, res) => {
    try {
        const { category } = req.body;
        const courses = await getFilteredCourse(category);
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
