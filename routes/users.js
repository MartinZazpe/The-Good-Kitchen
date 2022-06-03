//for FRONT-END, user logged cannot go to register or login but he shouldnt see the option either.


var express = require('express')
var router = express.Router()
const { body } = require('express-validator')
var userController = require('../controller/user-controller.js')
const configMulter = require("../middlewares/userImage.js")
const guestMiddleware = require("../middlewares/guestMiddleware.js")
const authMiddleware = require("../middlewares/authMiddleware.js")
const userRegister = require("../middlewares/userRegister.js")


//Create a user
router.get('/register', guestMiddleware, userController.create)
router.post('/register', configMulter.single('image'), userRegister, userController.store)


//login and navigate as a user
router.get('/login', guestMiddleware, userController.login)
router.post('/login', userController.processLogin)
router.get('/profile', authMiddleware, userController.userProfile)
router.get('/check', userController.checkLogin) //just to check if user is logged in, delete after
router.get('/logout', userController.logout)

//user detail - profile


//list of all users or at least the amount of users we have, or something cool.


module.exports = router