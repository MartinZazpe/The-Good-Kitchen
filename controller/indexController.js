var fs = require('fs')
var path = require('path')

//obtain all products
let dataJson = fs.readFileSync(path.join(__dirname, "../data/recipes.json"))
let productList = JSON.parse(dataJson)

//to obtain all users
let dataJsonUser = fs.readFileSync(path.join(__dirname, '../data/users.json'))
let users = JSON.parse(dataJsonUser)



module.exports = {
    indexAndRecents: (req, res) => {
        let recentUploads = productList.slice(-4)
        let allUsers = users
        //obtain all users
        //pass the users as a variable
        //on view, if the user owns that recipe, show his username and maybe his profile image

        res.render("index", {
            recipes: recentUploads, allUsers
        })
    },
    aboutUs: (req, res) => {
        res.render('about-us')
    },
    help: (req, res) => {
        res.render('help')
    }
}


