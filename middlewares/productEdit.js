const { body } = require('express-validator')


module.exports = [
    body('Ingredients').notEmpty().withMessage('Your recipe must contain at least 1 ingredient'),
    body('directions').notEmpty().withMessage('Your recipe must contain at least 1 instruction to help the user')
]