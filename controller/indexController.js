var fs = require('fs')
var path = require('path')

let dataJson = fs.readFileSync(path.join(__dirname, "../data/recipes.json"))
let productList = JSON.parse(dataJson)

module.exports = {
    index: (req, res) => {
        let recentUploads = productList.slice(1, 3)
        console.log(recentUploads)
        res.render("index", { recentUploads })
    }
}


