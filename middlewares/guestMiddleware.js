function guestMiddleware(req, res, next) {
    if (req.session.userLogged) {
        res.redirect('/user/profile')
    }
    next()
}


//si el usuario esta logueado, no deberia poder crear una cuenta. por ende msj o redirijir,


module.exports = guestMiddleware