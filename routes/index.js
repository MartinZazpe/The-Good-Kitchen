var express = require('express')
var router = express.Router()
var indexController = require('../controller/indexController.js')


/* GET home page. */
router.get('/', indexController.indexAndRecents)


/* GET about us */
router.get('/about-us', indexController.aboutUs)

/* GET help */
router.get('/help', indexController.help)


router.get('/aboutThisProject', indexController.aboutThisProject)

module.exports = router
