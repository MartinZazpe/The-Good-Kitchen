var express = require('express')
var router = express.Router()
var productController = require('../controller/product-controler.js')

/* show product list */
router.get('/list', productController.productList)


module.exports = router