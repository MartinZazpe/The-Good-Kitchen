var express = require('express')
var router = express.Router()
var indexController = require('../controller/indexController.js')


/* GET home page. */
router.get('/', indexController.index)

module.exports = router
