const { sql } = require('./studentModel');

module.exports = {
    sql,
    getAllCourses: async () => sql`SELECT * FROM Course`,
    getCourseById: async (course_id) => sql`SELECT * FROM Course WHERE course_id = ${course_id}`,
    addCourse: async (course) => sql`INSERT INTO Course ${sql(course)}`,
    enrollStudentInCourse: async (course_id, student_id) => sql`UPDATE Course SET student_id = ${student_id} WHERE course_id = ${course_id}`,
    unenrollStudentFromCourse: async (course_id) => sql`UPDATE Course SET student_id = NULL WHERE course_id = ${course_id}`,
    getFilteredCourse: async (category) => sql`SELECT * FROM Course WHERE category = ${category}`
};
