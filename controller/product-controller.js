// now it takes the input for ingredients and saves as a array perfectly, doesnt display yet.
//must validate that form isnt empty and isnt X so long

const { validationResult } = require('express-validator')
var fs = require('fs')
var path = require('path')
// const { nextTick } = require('process')




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

//for MYSQL db
const db = require('../database/models')
const Op = db.Sequelize.Op

module.exports = {
    productList: async (req, res) => {


        let allUsers = await db.User.findAll({
        })
        let allRecipes = await db.Recipe.findAll({
            include: [{ association: "users" }]
        })
        if (req.session.userLogged) {
            // let userHasProducts = data.filter(recipes => recipes.belongsTo == req.session.userLogged.email)
            let userLogged = req.session.userLogged
            res.render('product-list', {
                recipes: allRecipes, userLogged, allUsers
            })
        } else if (!req.session.userLogged) {
            res.render('product-list', {
                recipes: allRecipes, allUsers
            })
        }

    },
    detail: async (req, res) => {


        let recipeRs = await db.Recipe.findOne({
            where: {
                id: req.params.id
            },
            include: [{ association: "comments" }, { association: "ingredients" }, { association: "directions" }, { association: "users" }]
        }).catch(error => {
            // console.log(error)
        })

        let allUsers = await db.User.findAll()

        //PENDING TO SHOW INGREDIENTS AND STEPS AFTER WE UPLOAD A PRODUCT TO CHECK THAT WORKS!
        // let recipeFound = JSON.parse(recipeRs.ingredients)


        console.log(recipeRs.ingredients.ingredient)
        // console.log(recipeFound.ingredients)

        res.render('product-detail', {
            recipe: recipeRs, allUsers
        })

        // HICE HASTA ACÁ !!  CON BASES DE DATOS. NECESITO SOLUCIONAR USUARIOS CON TODO EL TEMA DE LOGIN PARA PODER SEGUIR


        let userLogged = req.session.userLogged
        // let ratingAvg = Math.floor(totalRating / amountOfReviews)
    },
    create: (req, res) => {
        res.render('product-create')
    },
    store: async (req, res) => {
        let errors = await validationResult(req)

        let userlogged = req.session.userLogged
        if (errors.isEmpty()) {
            const newRecipe = await db.Recipe.create({
                title: req.body.title,
                description: req.body.description,
                image: req.file ? req.file.filename : "no-image-default.png",
                user_id: req.session.userLogged.id
            }).then(async (newRecipe) => {
                if (newRecipe) {
                    let directions = req.body.directions
                    // await directions.map((str, index) => ({ ingredient: str, recipes_id: newRecipe.id }))
                    await directions.forEach(element => {
                        console.log(element)
                        db.Directions.create({
                            direction: element,
                            recipes_id: newRecipe.id
                        })
                    })
                    return newRecipe
                }
            }).then(async (newRecipe) => {
                if (newRecipe) {
                    let ingredients = req.body.Ingredients
                    await ingredients.forEach(element => {
                        db.RecipeIngredients.create({
                            ingredient: element,
                            recipes_id: newRecipe.id
                        })
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        }
        res.redirect("/recipes/list")
    },

    edit: async (req, res) => {
        let recipeFound = await db.Recipe.findByPk(req.params.id, { include: ["ingredients", "directions"] })

        // HICE HASTA ACÁ !! carga parcialmente por eso incluimos ingredientes y directions para poder iterarlas directametne en la vista.


        // console.log(JSON.stringify(recipeFound.users.name))
        console.log(JSON.stringify(recipeFound))
        console.log(req.session.userLogged.id)

        if (recipeFound.user_id == req.session.userLogged.id) {
            res.render('product-edit', { recipe: recipeFound })
        } else {
            res.redirect('/error404')
        }
        //current issue now i can modify any recipe if logged in
    },
    update: async (req, res) => {
        let recipeFound = await db.Recipe.findOne({ where: { id: req.params.id } })
        let allUsers = await db.User.findAll()
        let userLogged = req.session.userLogged
        let errors = await validationResult(req)

        if (errors.length > 1) {
            // console.log(errors)
            return res.render('product-edit', {
                recipe: recipeFound, errors: errors.mapped()
            })
        } else if (errors.isEmpty()) {

            recipeFound.title = req.body.title ? req.body.title : recipeFound.title
            recipeFound.description = req.body.description ? req.body.description : recipeFound.description
            recipeFound.Ingredients = req.body.Ingredients ? req.body.Ingredients.filter(ingredient => ingredient != "") : recipeFound.Ingredients
            recipeFound.directions = req.body.directions ? req.body.directions.filter(direction => direction != "") : recipeFound.direction
            recipeFound.image = req.file ? req.file.filename : recipeFound.image ? recipeFound.image : "no-image-default.png"


            writeJSON()
        }
        res.render('product-list', {
            recipes: data, userLogged, allUsers
        })


        // if (req.session.userLogged) {
        //     // let userHasProducts = data.filter(recipes => recipes.belongsTo == req.session.userLogged.email)
        //     let userLogged = req.session.userLogged
        //     res.render('product-list', {
        //         recipes: data, userLogged, allUsers
        //     })
        // }
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
        let productComments = commentData.filter(id => req.params.id == id.refersToProductId)

        let totalRating = 0
        for (let i = 0;i < productComments.length;i++) {
            totalRating += productComments[i].rating
        }


        if (!req.session.userLogged) {
            return res.render('login', {
                errors: {
                    LoggedToComment: {
                        msg: 'You must be logged in to leave a comment'
                    }
                }
            })
        }


        let lastComment = commentData[commentData.length - 1]
        let lastCommentDate = lastComment.timeOfComment

        let timeNow = Date.parse(new Date())



        if (lastComment.belongsToUserId == userLogged.id) {
            var difference = (((timeNow - lastCommentDate) / 1000) / 60)
            // console.log(difference)
            if ((difference) < 1) {
                // let productComments = commentData.filter(id => req.params.id == id.refersToProductId)
                let amountOfReviews = productComments.filter(x => x.rating != null).length
                let ratingAvg = Math.floor(totalRating / amountOfReviews)

                return res.render('product-detail', {
                    comments: productComments, recipe: recipeFound, userLogged, allUsers, amountOfReviews, ratingAvg, errors: {
                        mustWaitToComment: {
                            msg: 'please wait at least 1 minute before leaving another comment'
                        }
                    }
                })
            }
        }
        if (lastComment.belongsToUserId != userLogged.id || ((((timeNow - lastCommentDate) / 1000) / 60) > 1)) {
            let newComment = {
                refersToProductId: req.params.id,
                belongsToUserId: userLogged.id,
                userComment: req.body.comments,
                rating: Number(req.body.rate),
                timeOfComment: Date.parse(new Date())
            }
            // req.body.comments = ""
            commentData.push(newComment)
            WriteCommentJSON()


            let productComments = commentData.filter(id => req.params.id == id.refersToProductId)
            let totalRating = 0
            for (let i = 0;i < productComments.length;i++) {
                totalRating += productComments[i].rating
            }
            let amountOfReviews = productComments.filter(x => x.rating != null).length
            let ratingAvg = Math.floor(totalRating / amountOfReviews)




            let recipeFound = data.find(recipe => recipe.id == req.params.id)
            /* overwrite rating or create it */
            recipeFound.ratingAvg = (ratingAvg != null) ? ratingAvg : null
            /* overwrite JSON */
            writeJSON()

            return res.render('product-detail', {
                comments: productComments, recipe: recipeFound, userLogged, allUsers, amountOfReviews, ratingAvg
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

        let bestRanked = allProducts.filter(element => element.ratingAvg == "5")
        let TwoBestRanked = bestRanked.slice(-2)



        if (filteredProducts.length == 0) {
            res.render("index", {
                recipes: recentUploads, allUsers, TwoBestRanked
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




