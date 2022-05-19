var express = require('express')
var router = express.router

/* show product list */

router.get('/recipes', function (req, res) {
    res.render('product-list.ejs')
})