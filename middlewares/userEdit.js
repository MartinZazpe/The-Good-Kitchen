const { body } = require('express-validator')


module.exports = [
    body('name').notEmpty().withMessage('The field name must be complete').isLength({ max: 20 }).withMessage('The name can not be longer than 20 characters'),
    body('email').isEmail().withMessage('Must enter a valid email'),
]