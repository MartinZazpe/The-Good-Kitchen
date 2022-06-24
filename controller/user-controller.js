//image uploads even when form fails and user is not created, should check if same happens for product
//When updating an image, it gets deleted


const { validationResult } = require('express-validator')
var fs = require('fs')
var path = require('path')
let bcryptjs = require('bcryptjs')
let userModels = require('../models/User.js')
const session = require('express-session')

//to obtain all recipes 
let dataJson = fs.readFileSync(path.join(__dirname, '../data/recipes.json'))
let data = JSON.parse(dataJson)

//to obtain all users
let dataJsonUser = fs.readFileSync(path.join(__dirname, '../data/users.json'))
let users = JSON.parse(dataJsonUser)

function writeUsersDb() {
    let dataStringify = JSON.stringify(users, null, 4)
    fs.writeFileSync(path.join(__dirname, '../data/users.json'), dataStringify)
}


module.exports = {
    create: (req, res) => {
        res.cookie('testing', 'Hola mundo', { maxAge: 1000 * 30 })
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
            })
        }
        if (errors.isEmpty()) {
            let newUSer = {
                name: req.body.name,
                email: req.body.email,
                type: "Community member",
                password: bcryptjs.hashSync(req.body.password, 10),
                image: req.file ? req.file.filename : 'user-default.png'
            }
            userModels.create(newUSer)
            return res.render('login', { errors: { successful: { msg: 'Thank you for your registration. Log in and start enjoying!' } } })
        }
        return res.render('register', {
            errors: errors.mapped(),
            oldData: req.body,
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
                delete userToLogin.password // << deletes the user´s password before assigning to session
                req.session.userLogged = userToLogin
                if (req.body.rememberUser) {
                    res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
                }
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
        res.render('user-profile', {
            user: req.session.userLogged
        })
    },
    logout: (req, res) => {
        req.session.destroy()
        res.clearCookie('userEmail')
        // console.log(req.session)
        return res.redirect('/')
    },
    editProfile: (req, res) => {
        let userNewInfo = users.find(user => user.id == req.session.userLogged.id)
        userNewInfo.name = req.body.name ? req.body.name : userNewInfo.name
        userNewInfo.email = req.body.email ? req.body.email : userNewInfo.email
        userNewInfo.image = req.file ? req.file.filename : userNewInfo.image ? userNewInfo.image : 'user-default.png'

        console.log(req)

        writeUsersDb()
        res.clearCookie('userEmail')
        req.session.userLogged.email = userNewInfo.email
        res.cookie('userEmail', userNewInfo.email, { maxAge: (1000 * 60) * 60 })
        res.render('user-profile', {
            user: userNewInfo
        })
    },

    userProducts: (req, res) => {
        let userRecipes = data.filter(data => data.belongsTo == req.session.userLogged.id)
        let totalRecipes = userRecipes.length
        console.log(userRecipes)
        if (userRecipes.length !== 0) {
            res.render('user-recipes', { recipes: userRecipes, totalRecipes })
        } else {
            res.render('user-profile', {
                errors: {
                    noRecipes: {
                        msg: "You have no recipes uploaded"
                    }
                },
                user: req.session.userLogged
            })
        }



        // res.render('user-recipes', { recipes: userRecipes })
    }
}

//should also pass middleware so userProducts not accesible unless logged in

