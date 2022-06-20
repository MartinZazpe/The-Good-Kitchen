const { body } = require('express-validator')


module.exports = [
    body('title').isLength({ min: 1, max: 30 }).withMessage('Field can´t be empty. Enter a title, maximum 30 characters'),
    body('description').isLength({ min: 1, max: 350 }).withMessage('Description can´t be empty. Enter a description, maximum  characters'),
    body('Ingredients').notEmpty().withMessage('Your recipe must contain at least 1 ingredient'),
    body('directions').notEmpty().withMessage('Your recipe must contain at least 1 instruction to help the user')
]