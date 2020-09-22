module.exports = {
    age(timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)

        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth()  - birthDate.getMonth()

        today.getDate()
        birthDate.getDate()

        if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1
        }

        return age
    },

    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day, 
            month,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },

    graduation(value) {
        let expr = value
        switch(expr) {
            case "1":
                return "Ensino Médio Completo"
            case "2":
                return "Ensino Superior Completo"
            case "3": 
                return "Mestrado e Doutorado"
        }
    }
}