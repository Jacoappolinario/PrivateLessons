const Teachers = require('../models/Teachers')

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
    show(req, res) {
        return
    },
    edit(req, res) {
        return
    },
    put(req, res) {
        return
    },
    delete(req, res) {
        return
    }
} 