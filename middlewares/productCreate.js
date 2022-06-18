const { body } = require('express-validator')


module.exports = [
    body('title').isLength({ min: 1, max: 20 }).withMessage('Field can´t be empty. Enter a title, maximum 20 characters'),
    body('description').notEmpty().withMessage('Description can´t be empty. Enter a description, maximum 80 characters'),
    body('Ingredients').notEmpty().withMessage('Your recipe must contain at least 1 ingredient'),
    body('directions').notEmpty().withMessage('Your recipe must contain at least 1 instruction to help the user')
]