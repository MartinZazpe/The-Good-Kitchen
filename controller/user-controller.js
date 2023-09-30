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


//for MYSQL db
const db = require('../database/models')
const Op = db.Sequelize.Op



module.exports = {
    create: (req, res) => {
        // res.cookie('testing', 'Hola mundo', { maxAge: 1000 * 30 })
        return res.render('register')
    },
    store: async (req, res) => {


        let errors = await validationResult(req)

        let userInDB = await db.User.findOne({
            where: {
                email: req.body.email
            }
        })
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

        let newUser = ({
            name: req.body.name,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 10),
            image: req.file ? req.file.filename : 'user-default.png',
            user_type_id: 1
        })



        if (errors.isEmpty()) {
            await db.User.create(newUser)
            return res.render('login', { errors: { successful: { msg: 'Thanks for registering! Log in and enjoy!' } } })

        } else {
            return res.render('register', {
                errors: errors.mapped(),
                oldData: req.body,
            })
        }

    },
    login: (req, res) => {
        return res.render('login')
    },
    processLogin: async (req, res) => {

        let userToLogin = await db.User.findOne({ where: { email: req.body.email } })


        if (userToLogin) {
            let passwordOk = bcryptjs.compareSync(req.body.password, userToLogin.password)

            //DELETE PASSWORD OK ALWAYS TRUE, DISABLES COMPARE & PASSWORD CHECK;
            //  passwordOk = true

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
            user: res.locals.userLogged
        })
    },
    logout: (req, res) => {
        req.session.destroy()
        res.clearCookie('userEmail')
        // console.log(req.session)
        return res.redirect('/')
    },
    editProfile: async (req, res) => {
        let errors = validationResult(req)
        console.log(errors)
        if (errors.isEmpty()) {

            //let userNewInfo = await db.User.findOne({ where: { id: req.session.userLogged.id } })
            console.log(userNewInfo)
            // let userNewInfo = users.find(user => user.id == req.session.userLogged.id)
            await userNewInfo.update({
                name: req.body.name ? req.body.name : userNewInfo.name,
                email: req.body.email ? req.body.email : userNewInfo.email,
                image: req.file ? req.file.filename : userNewInfo.image ? userNewInfo.image : 'user-default.png'
            })
            res.clearCookie('userEmail')
            req.session.userLogged.email = userNewInfo.email
            res.cookie('userEmail', userNewInfo.email, { maxAge: (1000 * 60) * 60 })
            res.render('user-profile', {
                user: userNewInfo
            })
        }
        return res.render('user-profile', {
            errors: errors.mapped(), user: req.session.userLogged
        })
    },
    //All good up to here but locals not retaining after closing nav. Sometimes user may get logged out

    userProducts: async (req, res) => {
        await db.Recipe.findAll({
            where: {
                user_id: req.session.userLogged.id
            }
        }).then((userRecipes) => {
            let totalRecipes = userRecipes.length
            console.log(userRecipes)
            if (userRecipes.length !== 0) {
                res.render('user-recipes', { recipes: userRecipes, totalRecipes })
            }
        })
        // let userRecipes = data.filter(data => data.belongsTo == req.session.userLogged.id)
        res.render('user-profile', {
            errors: {
                noRecipes: {
                    msg: "You have no recipes uploaded"
                }
            },
            user: req.session.userLogged
        })

        // res.render('user-recipes', { recipes: userRecipes })
    },
    deleteUser: (req, res) => {
        let success = validationResult(req)
        let userLoggedId = req.session.userLogged.id
        console.log(userLoggedId)
        res.clearCookie('userEmail')
        req.session.destroy()
        userModels.delete(userLoggedId)
        return res.render('login', {
            success: {
                delete: {
                    msg: "User deleted correctly."
                }
            }
        })
    }
}

//should also pass middleware so userProducts not accesible unless logged in

