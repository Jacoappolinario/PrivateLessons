const Students = require('../models/Students')
const { date, grade, schoolYear } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        let results = await Students.paginate(filter, limit, offset)
        const students = results.rows

        students.pagination = {
            total: Math.ceil(students[0].total / limit),
            page
        }
        
        return res.render("students/index", { students, filter })            
            
    },
    async create(req, res) {
        let results = await Students.teachersSelectOptions()
        const teacherOptions = results.rows
        return res.render("students/create", { teacherOptions })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Pleas, fill all fields")
            }
        }

        let results = await Students.create(req.body)
        const student = results.rows[0].id

        return res.redirect(`/students/${student}`)
    },
    async show(req, res) {
        let results = await Students.find(req.params.id)
        const student = results.rows[0]

        student.birth = date(student.birth).birthDay
        student.school_year = grade(student.school_year)

        return res.render("students/show", { student })
    },
    async edit(req, res) {
        let results = await Students.find(req.params.id)
        const student = results.rows[0]

        student.birth = date(student.birth).iso

        results = await Students.teachersSelectOptions()
        const teacherOptions = results.rows 

        return res.render("students/edit", { student, teacherOptions })
    },
    async put(req, res) {
       const keys = Object.keys(req.body)

       for (key of keys) {
           if (req.body[key] == "") {
               return res.send("please, fill all fields")
           }
       }

       await Students.update(req.body)
      
       return res.redirect(`/students/${req.body.id}`)
    },
    async delete(req, res) {
        await Students.delete(req.body.id)

        return res.redirect(`/students`)
    }
} 