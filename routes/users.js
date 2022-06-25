//for FRONT-END, user logged cannot go to register or login but he shouldnt see the option either.
// Solamente faltaria poder editar y borrar un usuario

var express = require('express')
var router = express.Router()
const { body } = require('express-validator')
var userController = require('../controller/user-controller.js')
const configMulter = require("../middlewares/userImage.js")
const guestMiddleware = require("../middlewares/guestMiddleware.js")
const authMiddleware = require("../middlewares/authMiddleware.js")
const userRegister = require("../middlewares/userRegister.js")
const userEdit = require("../middlewares/userEdit.js")


//Create a user
router.get('/register', guestMiddleware, userController.create)
router.post('/register', configMulter.single('image'), userRegister, userController.store)


//login and navigate as a user
router.get('/login', guestMiddleware, userController.login)
router.post('/login', userController.processLogin)
router.get('/check', userController.checkLogin) //just to check if user is logged in, delete after


//user detail - profile
router.get('/profile', authMiddleware, userController.userProfile)
router.put('/profile', configMulter.single('image'), userEdit, userController.editProfile)
router.get('/profile/myRecipes', userController.userProducts)

//logout and delete
router.get('/logout', userController.logout)
router.delete('/delete', userController.deleteUser)

//list of all users or at least the amount of users we have, or something cool.





module.exports = router


//right now debbugging detail edit...