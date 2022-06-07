// now it takes the input for ingredients and saves as a array perfectly, doesnt display yet.

var fs = require('fs')
var path = require('path')
const { nextTick } = require('process')

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

        if (req.session.userLogged) {
            let userHasProducts = data.filter(recipes => recipes.belongsTo == req.session.userLogged.email)
            console.log(userHasProducts)
            let userLoggedEmail = req.session.userLogged.email
            console.log(userLoggedEmail)
            res.render('product-list', {
                recipes: data, userLoggedEmail
            })
        } else if (!req.session.userLogged) {
            res.render('product-list', { recipes: data })
        }
        //must paginate!
    },
    detail: (req, res) => {

        let recipeFound = data.find(recipe => recipe.id == req.params.id)
        let productComments = commentData.filter(id => req.params.id == id.refersToId)

        if (req.session.userLogged) {
            let userLoggedEmail = req.session.userLogged.email
            res.render('product-detail', { recipe: recipeFound, comments: productComments, userLoggedEmail })
        } else if (!req.session.userLogged) {
            res.render('product-detail', { recipe: recipeFound, comments: productComments })
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
        //ask if userLogged >> middleware OK
        //ask if userLogged in owns that recipe post OK
        //if user does own that recipe, OK
        //if not, render him to a ERROR view something "like hey what are you looking for?" OK
    },
    update: (req, res) => {
        let recipeFound = data.find(recipe => recipe.id == req.params.id)
        /* overwrite values if they are submit, else keep old value */
        recipeFound.title = req.body.title ? req.body.title : recipeFound.title
        recipeFound.description = req.body.description ? req.body.description : recipeFound.description
        recipeFound.Ingredients = req.body.Ingredients ? req.body.Ingredients.split(',') : recipeFound.Ingredients
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

        if (!req.session.userLogged) {
            res.render('login', {
                errors: {
                    LoggedToComment: {
                        msg: 'You must be logged in to leave a comment'
                    }
                }
            })
        }

        let userLoggedEmail = req.session.userLogged.email
        let newComment = {
            refersToId: req.params.id,
            belongsTo: userLoggedEmail,
            userComment: req.body.comments
        }



        commentData.push(newComment)
        WriteCommentJSON()

        let allComentsData = fs.readFileSync(path.join(__dirname, '../data/commentSection.json'))
        let allComents = JSON.parse(allComentsData)

        res.render('product-detail', { comments: allComents, recipe: recipeFound, userLoggedEmail })

        //Must paginate!
    }


}

