const { validationResult } = require('express-validator')

function authMiddleware(req, res, next) {
    if (!req.session.userLogged) {
        res.render('login', {
            errors: {
                loggedToCreate: {
                    msg: 'You must be logged in to upload a recipe'
                }
            }
        })
    }
    next()
}

module.exports = authMiddleware