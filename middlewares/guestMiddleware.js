function guestMiddleware(req, res, next) {
    if (req.session.usuarioLogueado == undefined) {
        next()
    } else {
        res.send('Esta pagina es solo para invitados')
    }
}


//si el usuario esta logueado, no deberia poder crear una cuenta. por ende msj o redirijir,


module.exports = guestMiddleware