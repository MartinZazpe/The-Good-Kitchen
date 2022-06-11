const { body } = require('express-validator')


module.exports = [
    body('name').notEmpty().isLength({ max: 20 }).withMessage('The field name must be complete'),
    body('email').isEmail().withMessage('Must enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters')
    // body('image').custom((value, { req }) => {
    //     let file = req.file
    //     if (!req.file) {
    //         throw new Error('Tienes que subir una imagen')
    //     }
    //     return true
    // }) >> Works, but image upload is optional.
]