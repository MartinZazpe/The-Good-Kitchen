// now it takes the input for ingredients and saves as a array perfectly, doesnt display yet.


var fs = require('fs')
var path = require('path')

let dataJson = fs.readFileSync(path.join(__dirname, '../data/recipes.json'))
let data = JSON.parse(dataJson)

function writeJSON() {
    let dataStringify = JSON.stringify(data, null, 4)
    fs.writeFileSync(path.join(__dirname, '../data/recipes.json'), dataStringify)
}


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
            title: req.body.title,
            description: req.body.description,
            Ingredients: req.body.Ingredients.split(','),
            image: req.file ? req.file.filename : "no-image-default.png"
        }
        console.log(newProduct)
        data.push(newProduct)
        writeJSON()
        res.redirect('/')
    }
}


//crea la receta pero no la muestra, ver lo de ingredientes