var express = require('express')
var router = express.Router()
const { body } = require('express-validator')
var productController = require('../controller/product-controller.js')
const configMulter = require("../middlewares/productImage")
const authMiddleware = require("../middlewares/authMiddleware.js")

/* show product list */
router.get('/list', productController.productList)

/* shows detail */
router.get('/detail/:id', productController.detail)

/*  create a product   */
router.get('/create', authMiddleware, productController.create)
router.post('/create', configMulter.single("image"), productController.store)

/*  edit a product   */
router.get('/edit/:id', productController.edit)
router.put('/edit/:id', configMulter.single("image"), productController.update)

/*  delete a product   */
router.delete('/delete/:id', productController.destroy)


module.exports = router