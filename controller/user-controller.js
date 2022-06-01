//image uploads even when form fails and user is not created, should check if same happens for product

const { validationResult } = require('express-validator')
var fs = require('fs')
var path = require('path')
let bcryptjs = require('bcryptjs')
let userModels = require('../models/User.js')
const session = require('express-session')



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
        let userInDB = userModels.findByField('email', req.body.email)
        if (userInDB) {
            return res.render('register', {
                errors: {
                    email: {
                        msg: 'This email is already registered'
                    }
                },
                oldData: req.body,
                // oldFile: req.file.filename
            })
        } //PROBLEMA, me guarda las imagenes aunque no se cree el usuario porque no detecta que hay errores?
        //minuto 49 --
        if (errors.isEmpty()) {
            let newUSer = {
                name: req.body.name,
                email: req.body.email,
                password: bcryptjs.hashSync(req.body.password, 10),
                image: req.file ? req.file.filename : 'user-default.png'
            }
            userModels.create(newUSer)
            res.redirect("/user/login") //cuando lo reenvie, deberia el usuario estar ya logeado.
        }
        return res.render('register', {
            errors: errors.mapped(),
            oldData: req.body,
            // oldFile: req.file.filename
        })
    },
    login: (req, res) => {
        return res.render('login')
    },
    processLogin: (req, res) => {

        let userToLogin = userModels.findByField('email', req.body.email)
        if (userToLogin) {
            let passwordOk = bcryptjs.compareSync(req.body.password, userToLogin.password)
            if (passwordOk) {
                delete userToLogin.password // << deletes the user´s password from session
                req.session.userLogged = userToLogin
                return res.redirect('/user/profile')
            }
        }
        return res.render('login', {
            errors: {
                email: {
                    msg: 'Invalid credentials'
                }
            }
        })
    },
    checkLogin: (req, res) => {
        if (req.session.userLogged == undefined) {
            res.send("No estas logueado")
        } else {
            res.send("El usuario logueado es " + req.session.userLogged.email)
        }
    },
    userProfile: (req, res) => {
        console.log('Estás en profile')
        console.log(req.session)
        res.render('user-profile', {
            user: req.session.userLogged
        })
    }
}

//video minuto 1:07