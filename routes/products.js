var express = require('express')
var router = express.Router()
var productController = require('../controller/product-controler.js')
const configMulter = require("../middlewares/productImage")

/* show product list */
router.get('/list', productController.productList)

/* shows detail */
router.get('/detail/:id', productController.detail)

/*  create a product   */
router.get('/create', productController.create)
router.post('/store', configMulter.single("image"), productController.store)

/*  edit a product   */
router.get('/edit/:id', productController.edit)
router.put('/store/:id', configMulter.single("image"), productController.update)

/*  delete a product   */
router.delete('/delete/:id', productController.delete)


module.exports = router