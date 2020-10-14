const db = require('./../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all() {
        return db.query(`
            SELECT *
            FROM students
            ORDER BY name ASC
        `)
    },
    // create(data) {
    //     const query = `
    //         INSERT INTO students (
    //             avatar_url,
    //             name,
    //             email,
    //             birth,
    //             school_year,
    //             workload,
    //             teacher_id
    //         ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    //         RETURNING id
    //     `

    //     const values = [
    //         data.avatar_url,
    //         data.name,
    //         data.email,
    //         date(data.birth).iso,
    //         data.school_year,
    //         data.workload,
    //         data.teacher
    //     ]

    //     return db.query(query, values)
    // },
    // find(id) {
    //     return db.query(`
    //         SELECT students.*, teachers.name AS teacher_name
    //         FROM students
    //         LEFT JOIN teachers ON (students.teacher_id = teachers.id)
    //         WHERE students.id = $1`, [id])
    // },
    // update(data) {
    //     const query = `
    //         UPDATE students SET
    //             avatar_url=($1),
    //             name=($2),
    //             email=($3),
    //             birth=($4),
    //             school_year=($5),
    //             workload=($6),
    //             teacher_id=($7)
    //         WHERE id = $8
    //         `

    //     const values = [
    //         data.avatar_url,
    //         data.name,
    //         data.email,
    //         date(data.birth).iso,
    //         data.school_year,
    //         data.workload,
    //         data.teacher,
    //         data.id
    //     ]

    //     return db.query(query, values)
    // },
    // delete(id) {
    //     return db.query(`DELETE FROM students WHERE id = $1`, [id])
    // },
    teachersSelectOptions() {
        return db.query(`SELECT name, id FROM teachers`)
    },
    paginate(filter, limit, offset) {
    
        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM students
            ) AS total`

            if (filter) {
                filterQuery = `${query}
                WHERE students.name ILIKE '%${filter}%'
                OR students.email ILIKE '%${filter}%'
                `

                totalQuery = `(
                    SELECT count(*) FROM students
                    ${filterQuery}
                ) as total`
            }

            query = `
            SELECT students.*, ${totalQuery}
            FROM students
            ${filterQuery}
            GROUP BY students.id LIMIT $1 OFFSET $2
            `

            return db.query(query, [limit, offset])
    }
}