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

        //check recipes and obtain the two best ranked 
        //return them as a variable

        let bestRanked = productList.filter(element => element.ratingAvg == "5")
        let TwoBestRanked = bestRanked.slice(-2)
        // console.log(TwoBestRanked)


        res.render("index", {
            recipes: recentUploads, allUsers, TwoBestRanked
        })
    },
    aboutUs: (req, res) => {
        res.render('about-us')
    },
    help: (req, res) => {
        res.render('help')
    },
    aboutThisProject: (req, res) => {
        res.render('about-this-project')
    }
}


