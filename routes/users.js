var express = require('express')
var router = express.Router()
const { body } = require('express-validator')
var userController = require('../controller/user-controller.js')
const configMulter = require("../middlewares/userImage.js")
// const configMulter = require("../middlewares/productImage")
const guestMiddleware = require("../middlewares/guestMiddleware.js")
const authtMiddleware = require("../middlewares/authMiddleware.js")



//validaciones
const validateUserCreate = [
    body('name').notEmpty().withMessage('The field name must be complete'),
    body('email').isEmail().withMessage('Must enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters')
    // body('image').custom((value, { req }) => {
    //     let file = req.file
    //     if (!req.file) {
    //         throw new Error('Tienes que subir una imagen')
    //     }
    //     return true
    // }) Works, but image upload is optional, if not, i should set it to upload a default image
]

// const validateUserLogin = [
//     check('email').isEmail(),
//     check('password')
// ]


//Create a user
router.get('/register', guestMiddleware, userController.create)
router.post('/register', configMulter.single('image'), validateUserCreate, userController.store)
//should redirect to profile

//login as a user
router.get('/login', userController.login)
router.post('/login', userController.processLogin)
router.get('/profile', userController.userProfile)
router.get('/check', userController.checkLogin) //just to check if user is logged in, delete after


//user detail - profile


//list of all users or at least the amount of users we have, or something cool.


module.exports = router