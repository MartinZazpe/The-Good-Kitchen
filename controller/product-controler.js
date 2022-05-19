var fs = require('fs')
var path = require('path')

let dataJson = fs.readFileSync(path.join(__dirname, '../data/recipes.json'))
let data = JSON.parse(dataJson)

module.exports = {
    productList: (req, res) => {
        res.render('product-list', { recipes: data })
    },
}