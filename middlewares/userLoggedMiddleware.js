const User = require('../models/User')

const db = require('../database/models')

async function userLoggedMiddleware(req, res, next) {
    res.locals.islogged = false

    let emailInCookie = req.cookies.userEmail

    let userFromCookie

    let checkForUserCookie = async () => {
        if (emailInCookie) {
            userFromCookie = await db.User.findOne({ where: { 'email': emailInCookie } })
            // console.log(userFromCookie)
            return userFromCookie
        }
        else {
            return null
        }
    }

    res.locals.userLogged = await await checkForUserCookie()

    if (userFromCookie) {
        req.session.userLogged = userFromCookie
    }

    if (req.session.userLogged) {
        res.locals.islogged = true
        res.locals.userLogged = req.session.userLogged
        // console.log(req.session.userLogged.email + " this is the res.locals.userLogged")
    }
    next()
}

module.exports = userLoggedMiddleware