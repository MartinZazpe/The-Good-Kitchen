// now it takes the input for ingredients and saves as a array perfectly, doesnt display yet.

var fs = require('fs')
var path = require('path')

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


module.exports = {
    productList: (req, res) => {
        res.render('product-list', { recipes: data })
    },
    detail: (req, res) => {
        let recipeFound = data.find(recipe => recipe.id == req.params.id)
        res.render('product-detail', { recipe: recipeFound })
    },
    create: (req, res) => {
        res.render('product-create')
    },
    store: (req, res) => {
        console.log(req.body)
        let newProduct = {
            id: data.length + 1,
            owner: req.session.userLogged.email,
            title: req.body.title,
            description: req.body.description,
            Ingredients: req.body.Ingredients.split(','),
            image: req.file ? req.file.filename : "no-image-default.png"
        }
        data.push(newProduct)
        writeJSON()
        res.redirect("/recipes/list")
    },
    edit: (req, res) => {
        let recipeFound = data.find(recipe => recipe.id == req.params.id)
        console.log("esto es la vista de edit" + recipeFound)
        res.render('product-edit', { recipe: recipeFound })
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
        // req.body.comments
        let userLoggedEmail = req.session.userLogged.email
        let newComment = {
            belongsTo: userLoggedEmail,
            userComment: req.body.comments
        }
        commentData.push(newComment)
        WriteCommentJSON()
        let allComentsData = fs.readFileSync(path.join(__dirname, '../data/commentSection.json'))
        let allComents = JSON.parse(allComentsData)

        res.render('product-detail', { comments: allComents, recipe: recipeFound })
        //check that user is logged only logged users can comment, OK, with middleware
        // obtain user email OK
        //when i get comments OK 
        //save them to comments json OK
        //print comments in comment section with user email
        //allow delete / edit comment
        // paginate comments to 5 or 10 max,
        //render view

    }


}


//crea la receta pero no la muestra, ver lo de ingredientes