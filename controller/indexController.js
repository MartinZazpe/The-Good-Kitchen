var fs = require('fs')
var path = require('path')

let dataJson = fs.readFileSync(path.join(__dirname, "../data/recipes.json"))
let productList = JSON.parse(dataJson)

module.exports = {
    indexAndRecents: (req, res) => {
        let recentUploads = productList.slice(-3)
        res.render("index", {
            recipes: recentUploads
        })
    },
    aboutUs: (req, res) => {
        res.render('about-us')
    },
    help: (req, res) => {
        res.render('help')
    }
}


