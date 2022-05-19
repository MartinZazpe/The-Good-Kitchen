var fs = require('fs')
var path = require('path')

let dataJson = fs.readFileSync(path.join(__dirname, "../data/recipes.json"))
let productList = JSON.parse(dataJson)

module.exports = {
    indexAndRecents: (req, res) => {
        let recentUploads = productList.slice(-3)
        console.log(recentUploads)
        res.render("index", {
            recipes: recentUploads
        })
    }
    // indexAndRecents: (req, res) => {
    //     let [result] = productList.slice(-1)
    //     console.log(result)
    //     res.render('index', { result })
    // }
}


