const { validationResult } = require('express-validator')
var fs = require('fs')
var path = require('path')
let bcrypt = require('bcryptjs')


let dataJsonUser = fs.readFileSync(path.join(__dirname, '../data/users.json'))
let users = JSON.parse(dataJsonUser)

function writeUsersDb() {
    let dataStringify = JSON.stringify(users, null, 4)
    fs.writeFileSync(path.join(__dirname, '../data/users.json'), dataStringify)
}



module.exports = {
    create: (req, res) => {
        return res.render('register')
    },
    store: (req, res) => {
        let errors = validationResult(req)
        if (errors.isEmpty()) {
            let newUSer = {
                id: users.length + 1,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10), //esto debo hashearlo
                file: req.file.filename
            }
            users.push(newUSer)
            writeUsersDb()
            res.redirect("/recipes/list") //cuando lo reenvie, deberia el usuario estar ya logeado.
        } else {
            console.log(errors)
            return res.render('register', {
                errors: errors.mapped(),
                oldData: req.body
            })
        }
    },
    login: (req, res) => {
        return res.render('login')
    },
    processLogin: (req, res) => {
        // let errors = validationResult(req)

        if (errors.isEmpty()) {
            for (let i = 0;i < users.length;i++) {
                if (users[i].email === req.body.email) {
                    if (bcrypt.compareSync(req.body.password, users[i].password)) {
                        userToLogin = users[i]
                        break
                    }
                }
            }
            if (userToLogin === undefined) {
                return res.render('login', { errors: [{ msg: 'Invalid credentials' }] })
            }
            req.session.usuarioLogueado = userToLogin
            res.render('register')
        } else {
            return res.render('login', { errors: errors.mapped() })
        }

    },
    checkLogin: (req, res) => {
        if (req.session.usuarioLogueado == undefined) {
            res.send("No estas logueado")
        } else {
            res.send("El usuario logueado es " + req.session.usuarioLogueado.email)
        }
    }
}
