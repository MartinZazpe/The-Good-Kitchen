//image uploads even when form fails and user is not created, should check if same happens for product
//When updating an image, it gets deleted


const { validationResult } = require('express-validator')
var fs = require('fs')
var path = require('path')
let bcryptjs = require('bcryptjs')
let userModels = require('../models/User.js')
const session = require('express-session')

const axios = require('axios')

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

        //check if user exists
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

        //create the new user
        let newUser = ({
            name: req.body.name,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 10),
            // image: req.file ? req.file.filename : 'user-default.png',
            user_type_id: 1
        })


        //redirection && setting image
        if (errors.isEmpty()) {

            //load the image with the new token created.
            try {
                const imgurResponse = await axios.post('https://api.imgur.com/3/image',
                    {
                        'image': req.file.buffer,
                        'album': "V2209x6"
                    },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${process.env.myAcessTokenEnv}`,
                        }
                    })
                newUser.image = imgurResponse.data.data.link

            } catch (error) {
                console.error('Error uploading image to Imgur:', error)

                //check if error is due to unauthorized, get new token and retry.
                if (error.request && error.request.socket && error.request.socket._rejectUnauthorized == true) {
                    try {
                        const tokens = await getImgurAccesToken(process.env.clientId, process.env.clientSecret, process.env.refreshToken)

                        const imgurResponseFallback = await axios.post('https://api.imgur.com/3/image',
                            {
                                'image': req.file.buffer,
                                'album': "V2209x6"
                            },
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    Authorization: `Bearer ${tokens.newAccessToken}`,
                                },
                            })
                        // console.log('this is this: ' + imgurResponseFallback.data.data.link)
                        newUser.image = imgurResponseFallback.data.data.link

                    } catch (fallbackError) {
                        console.log("Error, could not insert image or get a new token " + fallbackError)
                    }
                }
            }
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

            //     let userNewInfo = await users.find(user => user.id == req.session.userLogged.id)
            let userNewInfo = await db.User.findOne({ where: { id: req.session.userLogged.id } })
            console.log(userNewInfo)

            let imageUpdated = ""

            // console.log("usernewInfo image which should exist: " + userNewInfo.image)
            // console.log("the image as processed by multer: " + req.file.buffer)


            //if there is an image and it is diffrent from the one stored
            if (req.file.buffer != null) {
                //setting image, before updating user.
                if (errors.isEmpty()) {
                    //load the image with the new token created.
                    try {
                        const imgurResponse = await axios.post('https://api.imgur.com/3/image',
                            {
                                'image': req.file.buffer,
                                'album': "V2209x6"
                            },
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    Authorization: `Bearer ${process.env.myAcessTokenEnv}`,
                                }
                            })
                        imageUpdated = imgurResponse.data.data.link

                    } catch (error) {
                        console.error('Error uploading image to Imgur:', error)

                        //check if error is due to unauthorized, get new token and retry.
                        if (error.request && error.request.socket && error.request.socket._rejectUnauthorized == true) {
                            try {
                                const tokens = await getImgurAccesToken(process.env.clientId, process.env.clientSecret, process.env.refreshToken)

                                const imgurResponseFallback = await axios.post('https://api.imgur.com/3/image',
                                    {
                                        'image': req.file.buffer,
                                        'album': "V2209x6"
                                    },
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                            Authorization: `Bearer ${tokens.newAccessToken}`,
                                        },
                                    })
                                // console.log('this is this: ' + imgurResponseFallback.data.data.link)
                                imageUpdated = imgurResponseFallback.data.data.link

                            } catch (fallbackError) {
                                console.log("Error, could not insert image or get a new token " + fallbackError)
                            }
                        }
                    }
                } else {
                    //if there is no image, keep the one the user has.
                    imageUpdated = userNewInfo.image
                }
            }

            await userNewInfo.update({
                name: req.body.name ? req.body.name : userNewInfo.name,
                email: req.body.email ? req.body.email : userNewInfo.email,
                image: imageUpdated
                //image: req.file ? req.file.filename : userNewInfo.image ? userNewInfo.image : 'user-default.png'
            })

            res.clearCookie('userEmail')
            req.session.userLogged.email = userNewInfo.email
            res.cookie('userEmail', userNewInfo.email, { maxAge: (1000 * 60) * 60 })
            res.render('user-profile', {
                user: userNewInfo
            })
        } else {
            return res.render('user-profile', {
                errors: errors.mapped(), user: req.session.userLogged
            })
        }
    },


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
    },
}

// function get te
async function getImgurAccesToken(clientId, clientSecret, refreshToken) {
    try {
        const data = {
            client_id: encodeURIComponent(clientId),
            client_secret: encodeURIComponent(clientSecret),
            refresh_token: encodeURIComponent(refreshToken),
            grant_type: 'refresh_token',
        }

        const response = await axios.post('https://api.imgur.com/oauth2/token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        const newAccessToken = response.data.access_token
        const newRefreshToken = response.data.refresh_token

        // You can return the tokens or perform other actions as needed.
        return { newAccessToken, newRefreshToken }
    } catch (error) {
        console.error('Error obtaining access token:', error.message)
        throw error // Re-throw the error for the caller to handle if needed.
    }
}



