const Teachers = require('../models/Teachers')
const { age, date, graduation } = require('../../lib/utils')


module.exports = {
    async index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        let results = await Teachers.paginate(filter, limit, offset)
        const teachers = results.rows
        
        teachers.pagination = {
            total: Math.ceil(teachers[0].total / limit),
            page
        }
        
        return res.render("teachers/index", { teachers, filter })            
            

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
    async put(req, res) {
       const keys = Object.keys(req.body)

       for (key of keys) {
           if (req.body[key] == "") {
               return res.send("please, fill all fields")
           }
       }

       await Teachers.update(req.body)
      
       return res.redirect(`/teachers/${req.body.id}`)
    },
    async delete(req, res) {
        await Teachers.delete(req.body.id)

        return res.redirect(`/teachers`)
    }
} 