const { sql } = require('./studentModel');

module.exports = {
    sql,
    getAdminByEmail: async (email) => sql`SELECT * FROM provider WHERE admin_email = ${email}`,
    addAdmin: async (admin) => sql`INSERT INTO provider ${sql(admin)}`,
};
