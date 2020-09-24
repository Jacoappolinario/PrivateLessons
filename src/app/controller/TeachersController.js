const Teachers = require('../models/Teachers')
const { age, date, graduation } = require('../../lib/utils')


module.exports = {
    index(req, res) {
        return
    },
    create(req, res) {
        return res.render("teachers/create")
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Pleas, fill all fields")
            }
        }

        let results = await Teachers.create(req.body)
        const teacher = results.rows[0].id

        return res.redirect(`/teachers/${teacher}`)
    },
    async show(req, res) {
        let results = await Teachers.find(req.params.id)
        const teacher = results.rows[0]

        teacher.age = age(teacher.birth_date)
        teacher.education_level = graduation(teacher.education_level)
        teacher.subjects_taught = teacher.subjects_taught.split(",")
        teacher.created_at = date(teacher.created_at).format

        return res.render("teachers/show", { teacher })
    },
    async edit(req, res) {
        let results = await Teachers.find(req.params.id)
        const teacher = results.rows[0]

        teacher.birth_date = date(teacher.birth_date).iso

        return res.render("teachers/edit", { teacher })
    },
    put(req, res) {
        return
    },
    delete(req, res) {
        return
    }
} 