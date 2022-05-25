var express = require('express')
var router = express.Router()
const { body } = require('express-validator')
var userController = require('../controller/user-controller.js')
// const configMulter = require("../middlewares/productImage")

//validaciones
const validateUserCreate = [
    body('name').notEmpty().withMessage('The field name must be complete'),
    body('email').isEmail().withMessage('Must enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters')
]


//Create a user
router.get('/register', userController.create)
router.post('/register', validateUserCreate, userController.store)
//should redirect to profile

//login as a user
router.get('/login', userController.login)


//user detail - profile


//list of all users or at least the amount of users we have, or something cool.



// router.post('/login', check('email').isEmail().withMessage('email invalido'),
//     check('password').isLength({ min: 8 }).withMessage('la contraseña debe tener 8 caracteres'),
//     userController.processLogin)


module.exports = router