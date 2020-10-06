const db = require('./../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all() {
        return db.query(`
            SELECT teachers.*, count(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (students.teacher_id = teachers.id)
            GROUP BY teachers.id
            ORDER BY total_students DESC`)
    },
    create(data) {
        const query = `
            INSERT INTO teachers (
                avatar_url,
                name,
                birth_date,
                education_level,
                class_type,
                subjects_taught,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

        const values = [
            data.avatar_url,
            data.name,
            data.birth_date,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
                SELECT * 
                FROM teachers 
                WHERE id = $1`, [id])
    },
    update(data) {
        const query = `
            UPDATE teachers SET
                avatar_url=($1),
                name=($2),
                birth_date=($3),
                education_level=($4),
                class_type=($5),
                subjects_taught=($6)
                WHERE id = $7
            `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth_date).iso,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query(`DELETE FROM teachers WHERE id = $1`, [id])
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM teachers
            ) AS total`

            if (filter) {

                filterQuery = `${query}
                WHERE teachers.name ILIKE '%${filter}'
                OR teachers.subjects_taught ILIKE '%${filter}'
                `

                totalQuery = `(
                    SELECT count(*) FROM teachers
                    ${filter}
                ) as total`
            }

            query = `
            SELECT teachers.*, ${totalQuery}, count(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            ${filterQuery}
            GROUP BY teachers.id LIMIT $1 OFFSET $2
            `

            db.query(query, [limit, offset], function(err, results) {
                if (err) throw `Database Error! ${err}`

                callback(results.rows)
            })
    }
}