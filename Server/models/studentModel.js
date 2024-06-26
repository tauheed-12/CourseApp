const postgres = require('postgres')

const sql = postgres({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${process.env.ENDPOINT_ID}`
    },
});


module.exports = {
    sql,
    getStudentByEmail: async (email) => sql`SELECT * FROM Students WHERE email = ${email}`,
    addStudent: async (student) => sql`INSERT INTO Students ${sql(student)}`,
}