// now it takes the input for ingredients and saves as a array perfectly, doesnt display yet.
//must validate that form isnt empty and isnt X so long


var fs = require('fs')
var path = require('path')
const { nextTick } = require('process')




// get users

let usersJSON = fs.readFileSync(path.join(__dirname, '../data/users.json'))
let users = JSON.parse(usersJSON)


//for comments

let dataCommentJSON = fs.readFileSync(path.join(__dirname, '../data/commentSection.json'))
let commentData = JSON.parse(dataCommentJSON)

function WriteCommentJSON() {
    let dataStringify = JSON.stringify(commentData, null, 4)
    fs.writeFileSync(path.join(__dirname, '../data/commentSection.json'), dataStringify)
}

//for products

let dataJson = fs.readFileSync(path.join(__dirname, '../data/recipes.json'))
let data = JSON.parse(dataJson)

function writeJSON() {
    let dataStringify = JSON.stringify(data, null, 4)
    fs.writeFileSync(path.join(__dirname, '../data/recipes.json'), dataStringify)
}

// function deleteImage() { // NOT WORKING
//     fs.unlinkSync(path.join(__dirname, "../../public/images/" + foundImage.image))
// }


// if (req.session.userLogged) {
//     userLoggedOk = req.session.userLogged
//     let productsThatBelongToUser = data.filter(products => products.belongTo == userLoggedOk.email)
//     console.log(productsThatBelongToUser)
// }


module.exports = {
    productList: (req, res) => {
        let allUsers = users
        if (req.session.userLogged) {
            // let userHasProducts = data.filter(recipes => recipes.belongsTo == req.session.userLogged.email)
            let userLoggedEmail = req.session.userLogged.email
            res.render('product-list', {
                recipes: data, userLoggedEmail, allUsers
            })
        } else if (!req.session.userLogged) {
            res.render('product-list', { recipes: data, allUsers })
        }
        //must paginate!
    },
    detail: (req, res) => {

        let recipeFound = data.find(recipe => recipe.id == req.params.id)
        let productComments = commentData.filter(id => req.params.id == id.refersToId)
        let allUsers = users
        let userLogged = req.session.userLogged

        // productComments.reduce(function (a, b) { return a + b.rating }, 0)
        // console.log(productComments)

        //find the Id of the current product
        //check for that ID the sum of all ratings
        //return them in a variable



        let totalRating = 0
        for (let i = 0;i < productComments.length;i++) {
            totalRating += productComments[i].rating
        }
        let amountOfReviews = productComments.filter(x => x.rating != null).length
        let ratingAvg = Math.floor(totalRating / amountOfReviews)

        console.log(amountOfReviews)

        if (req.session.userLogged) {
            let userLogged = req.session.userLogged
            res.render('product-detail', {
                recipe: recipeFound, comments: productComments, userLogged, allUsers, amountOfReviews, ratingAvg, userLogged
            })
        } else if (!req.session.userLogged) {
            res.render('product-detail', {
                recipe: recipeFound, comments: productComments, allUsers, amountOfReviews, ratingAvg
            })
        }
    },
    create: (req, res) => {
        res.render('product-create')
    },
    store: (req, res) => {
        console.log(req.body)
        let newProduct = {
            id: data.length + 1,
            title: req.body.title,
            description: req.body.description,
            Ingredients: req.body.Ingredients.split(','),
            directions: req.body.directions.split(','),
            image: req.file ? req.file.filename : "no-image-default.png",
            belongsTo: req.session.userLogged.email
        }
        data.push(newProduct)
        writeJSON()
        res.redirect("/recipes/list")
    },
    edit: (req, res) => {
        let recipeFound = data.find(recipe => recipe.id == req.params.id)
        if (recipeFound.belongsTo == req.session.userLogged.email) {
            res.render('product-edit', { recipe: recipeFound })
        } else {
            res.redirect('/error404')
        }
        //current issue now i can modify any recipe if logged in
    },
    update: (req, res) => {
        let recipeFound = data.find(recipe => recipe.id == req.params.id)
        /* overwrite values if they are submit, else keep old value */
        recipeFound.title = req.body.title ? req.body.title : recipeFound.title
        recipeFound.description = req.body.description ? req.body.description : recipeFound.description
        recipeFound.Ingredients = req.body.Ingredients ? req.body.Ingredients.split(',') : recipeFound.Ingredients
        recipeFound.directions = req.body.directions ? req.body.Ingredients.directions(',') : recipeFound.directions
        recipeFound.image = req.file ? req.file.filename : recipeFound.image ? recipeFound.image : "no-image-default.png"
        /* overwrite JSON */
        writeJSON()
        res.redirect("/recipes/list")
    },
    destroy: (req, res) => {
        let recipeFound = data.findIndex(recipe => recipe.id == req.params.id)

        //this code deletes image, however it also deletes the default image, leave like this for now.
        // let imageFound = data.find(recipe => recipe.id == req.params.id)
        // fs.unlinkSync(path.join(__dirname, "../public/images/" + imageFound.image))

        data.splice(recipeFound, 1)
        writeJSON()
        res.redirect('/recipes/list')
    },

    submitComment: (req, res) => {

        let recipeFound = data.find(recipe => recipe.id == req.params.id)
        let userLogged = req.session.userLogged
        let allUsers = users

        if (!req.session.userLogged) {
            res.render('login', {
                errors: {
                    LoggedToComment: {
                        msg: 'You must be logged in to leave a comment'
                    }
                }
            })
        }

        let lastComment = commentData[commentData.length - 1]
        let lastCommentDate = lastComment.timeOfComment


        console.log(lastComment)

        let timeNow = Date.parse(new Date())

        // if (commentData.Object.keys().belongsTo == 0) {
        //     ('theres  no comments')
        // }

        if (lastComment.belongsTo == userLogged.email) {
            var difference = (((timeNow - lastCommentDate) / 1000) / 60)
            console.log(difference)
            if ((difference) < 1) {
                let productComments = commentData.filter(id => req.params.id == id.refersToId)
                res.render('product-detail', {
                    comments: productComments, recipe: recipeFound, userLogged, allUsers, errors: {
                        mustWaitToComment: {
                            msg: 'please wait at least 1 minute before leaving another comment'
                        }
                    }
                })
            }
        }
        if (lastComment.belongsTo != userLogged.email || ((((timeNow - lastCommentDate) / 1000) / 60) > 1)) {
            let newComment = {
                refersToId: req.params.id,
                belongsTo: userLogged.email,
                userComment: req.body.comments,
                rating: Number(req.body.rate),
                timeOfComment: Date.parse(new Date())
            }
            // req.body.comments = ""
            commentData.push(newComment)
            WriteCommentJSON()
            let productComments = commentData.filter(id => req.params.id == id.refersToId)
            res.render('product-detail', {
                comments: productComments, recipe: recipeFound, userLogged, allUsers
            })
        }

        //Must paginate!

    },
    search: (req, res) => {


        let userSearch = req.body.search
        let allProducts = data
        let recentUploads = allProducts.slice(-4)
        let allUsers = users

        let filteredProducts = allProducts.filter(x => x.title.toUpperCase().match(userSearch.toUpperCase()))


        console.log(filteredProducts)


        if (filteredProducts.length == 0) {
            res.render("index", {
                recipes: recentUploads, allUsers
            })
        } else if (req.session.userLogged) {
            // let userHasProducts = data.filter(recipes => recipes.belongsTo == req.session.userLogged.email)
            let userLoggedEmail = req.session.userLogged.email
            res.render('product-list', {
                recipes: filteredProducts, userLoggedEmail, allUsers,
            })
        } else if (!req.session.userLogged && filteredProducts.length != 0) {
            res.render('product-list', { recipes: filteredProducts, allUsers, })
        }

    }

}




