var express = require('express')
var router = express.Router()
const { body } = require('express-validator')
var productController = require('../controller/product-controller.cjs')
const configMulter = require("../middlewares/ImageMulter.js")
const authMiddleware = require("../middlewares/authMiddleware.js")
const productCreate = require("../middlewares/productCreate.js")
const productEdit = require("../middlewares/productEdit.js")

/* show product list */
router.get('/list', productController.productList)

/* shows detail */
router.get('/detail/:id', productController.detail)

/* Comment */
router.post('/comments/:id', productController.submitComment)

/*  create a product   */
router.get('/create', authMiddleware, productController.create)
router.post('/create', configMulter.single("image"), productCreate, productController.store)

/*  edit a product   */
router.get('/edit/:id', authMiddleware, productController.edit)
router.put('/edit/:id', authMiddleware, configMulter.single("image"), productEdit, productController.update)

/*  Search products */
router.post('/search', productController.search)

/*  delete a product   */
router.delete('/delete/:id', productController.destroy)


module.exports = router