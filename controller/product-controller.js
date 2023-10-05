// now it takes the input for ingredients and saves as a array perfectly, doesnt display yet.
//must validate that form isnt empty and isnt X so long

const { validationResult } = require('express-validator')
var fs = require('fs')
var path = require('path')
// const { nextTick } = require('process')

const axios = require('axios')


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


        //get the avg rating for each recipe
        let recipeRatings = await Promise.all(allRecipes.map(async (element) => {
            let getRecipeRating = await obtainRecipeAvg(element.id)

            if (getRecipeRating != null && getRecipeRating != 0) {
                return {
                    recipe_id: element.id,
                    ratingAvg: getRecipeRating
                }
            }
            else {
                return null
            }
        }))

        recipeRatings = recipeRatings.filter(rating => rating !== null && rating.ratingAvg !== 0)
        console.log('this should be an array with objects of ratings ' + recipeRatings.ratingAVG)


        if (req.session.userLogged) {
            // let userHasProducts = data.filter(recipes => recipes.belongsTo == req.session.userLogged.email)
            let userLogged = req.session.userLogged
            res.render('product-list', {
                recipes: allRecipes, userLogged, allUsers, recipeRatings
            })
        } else if (!req.session.userLogged) {
            res.render('product-list', {
                recipes: allRecipes, allUsers, recipeRatings
            })
        }

    },
    detail: async (req, res) => {

        let ratingAVG = 0

        let recipeRs = await db.Recipe.findOne({
            where: {
                id: req.params.id
            },
            include: [{ association: "comments" }, { association: "ingredients" }, { association: "directions" }, { association: "users" }]
        }).catch(error => {
            // console.log(error)
        })

        //get the avg rating
        if (recipeRs != null) {
            ratingAVG = await obtainRecipeAvg(recipeRs.id)
        }

        let allUsers = await db.User.findAll()

        res.render('product-detail', {
            recipe: recipeRs, allUsers, ratingAVG
        })

        let userLogged = req.session.userLogged
    },
    create: (req, res) => {
        res.render('product-create')
    },
    store: async (req, res) => {
        let errors = await validationResult(req)
        let userlogged = req.session.userLogged

        let recipeImage = ""


        //await db.User.create(newUser)

        if (errors.isEmpty()) {

            //load the image with the new token created.
            if (req.file != null) {
                try {
                    const imgurResponse = await axios.post('https://api.imgur.com/3/image',
                        {
                            'image': req.file.buffer,
                            'album': "8tIaaR9"
                        },
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${process.env.myAcessTokenEnv}`,
                            }
                        })
                    recipeImage = imgurResponse.data.data.link
                }
                catch (error) {
                    console.error('Error uploading image to Imgur:', error)

                    //check if error is due to unauthorized, get new token and retry.
                    if (error.request && error.request.socket && error.request.socket._rejectUnauthorized == true) {
                        try {
                            const tokens = await getImgurAccesToken(process.env.clientId, process.env.clientSecret, process.env.refreshToken)

                            const imgurResponseFallback = await axios.post('https://api.imgur.com/3/image',
                                {
                                    'image': req.file.buffer,
                                    'album': "8tIaaR9"
                                },
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                        Authorization: `Bearer ${tokens.newAccessToken}`,
                                    },
                                })
                            // console.log('this is this: ' + imgurResponseFallback.data.data.link)
                            recipeImage = imgurResponseFallback.data.data.link

                        } catch (fallbackError) {
                            console.log("Error, could not insert image or get a new token " + fallbackError)
                        }
                    }
                }
            }

            //then after handling image logic we can proceede
            const newRecipe = await db.Recipe.create({
                title: req.body.title,
                description: req.body.description,
                image: req.file && recipeImage != "" ? recipeImage : "",
                user_id: req.session.userLogged.id
            }).then(async (newRecipe) => {
                if (newRecipe) {
                    let directions = req.body.directions
                    // await directions.map((str, index) => ({ ingredient: str, recipes_id: newRecipe.id }))
                    await directions.forEach(element => {
                        if (element != null && element != "") {
                            db.Directions.create({
                                direction: element,
                                recipes_id: newRecipe.id
                            })
                        }
                    })
                    return newRecipe
                }
            }).then(async (newRecipe) => {
                if (newRecipe) {
                    let ingredients = req.body.Ingredients
                    await ingredients.forEach(element => {
                        if (element != null && element != "") {
                            db.RecipeIngredients.create({
                                ingredient: element,
                                recipes_id: newRecipe.id
                            })
                        }
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        }
        res.redirect("/recipes/list")
    },

    edit: async (req, res) => {
        let recipeFound = await db.Recipe.findByPk(req.params.id, { include: ["directions", "ingredients"] })

        if (recipeFound.user_id == req.session.userLogged.id) {
            res.render('product-edit', { recipe: recipeFound })
        } else {
            res.redirect('/error404')
        }

    },
    update: async (req, res) => {
        try {
            // Fetch the recipe to edit
            let recipeFound = await db.Recipe.findOne({ where: { id: req.params.id } })

            if (!recipeFound) {
                // Handle case where the recipe is not found
                return res.status(404).send("Recipe not found")
            }

            // Validate the request data
            let errors = await validationResult(req)

            if (errors.length > 0) {
                return res.render('product-edit', {
                    recipe: recipeFound,
                    errors: errors.mapped()
                })
            }

            // Update the recipe data
            recipeFound.title = req.body.title || recipeFound.title
            recipeFound.description = req.body.description || recipeFound.description

            // Update directions (delete and insert new ones)
            await db.Directions.destroy({ where: { 'recipes_id': recipeFound.id } })
            let directions = req.body.directions || []
            await db.Directions.bulkCreate(directions.map(element => ({ direction: element, recipes_id: recipeFound.id })),
                { ignoreDuplicates: true })

            // Update ingredients (delete and insert new ones)
            await db.RecipeIngredients.destroy({ where: { 'recipes_id': recipeFound.id } })
            let ingredients = req.body.Ingredients || []
            await db.RecipeIngredients.bulkCreate(ingredients.map(element => ({ ingredient: element, recipes_id: recipeFound.id })),
                { ignoreDuplicates: true })

            //handle image, only if something is on req.file
            console.log("Before image upload")
            try {
                let newProductImageLink = await uploadImgToImgur(req)
                if (newProductImageLink != null) {
                    recipeFound.image = newProductImageLink
                }
            } catch (error) {
                console.log("Image upload error:", error)
            }


            // Save the updated recipe
            await recipeFound.save()

            // Fetch updated data to render
            let data = await db.Recipe.findAll()
            let allUsers = await db.User.findAll()
            let userLogged = req.session.userLogged

            res.render('product-list', {
                recipes: data,
                userLogged,
                allUsers
            })
        } catch (error) {

            //get the recipe we are editting
            let recipeFound = await db.Recipe.findByPk(req.params.id, { include: ["directions", "ingredients"] })

            if (error.name === 'SequelizeUniqueConstraintError') {
                console.error("Duplicate entry error:", error)

                res.render('product-edit',
                    {
                        recipe: recipeFound,
                        duplicateEntryError: 'Duplicate entry error. Please ensure there are no duplicate directions or ingredients.'
                    })
            } else {
                console.error("Error during update:", error)
                res.status(500).send("Internal Server Error")
            }
        }
    },
    destroy: async (req, res) => {

        try {
            //find recipe to delete
            let recipeToDelete = await db.Recipe.findOne({ where: { id: req.params.id } })

            db.Recipe.destroy({ where: { 'id': recipeToDelete.id } })

            // Fetch updated data to render
            let data = await db.Recipe.findAll()
            let allUsers = await db.User.findAll()
            let userLogged = req.session.userLogged

            res.render('product-list', {
                recipes: data,
                userLogged,
                allUsers
            })
        } catch (error) {
            res.render('product-list',
                {
                    recipe: recipeFound,
                    deleteError: 'Error when trying to delete recipe.'
                })
        }
    },

    submitComment: async (req, res) => {

        let totalComments = 0
        let diffrenceMinutes
        let scrollToComments = 'comment-section'


        try {
            //find recipe to comment
            let recipeToComment = await db.Recipe.findOne({ where: { id: req.params.id } })
            let userLogged = req.session.userLogged
            let data = await db.Recipe.findAll()
            let allUsers = await db.User.findAll()
            //find all comments on the recipe
            let allComments = await db.Comment.findAll({ where: { recipes_id: recipeToComment.id } })


            //if user is not logged in...
            if (!req.session.userLogged) {
                return res.render('login', scrollToComments, {
                    errors: {
                        LoggedToComment: {
                            msg: 'You must be logged in to leave a comment'
                        }
                    }
                })
            }

            //if user IS logged in, get the newest comment if theres any.
            if (userLogged.id != null) {

                let lastUserComment = await db.Comment.findOne({
                    where: {
                        recipes_id: recipeToComment.id,
                        users_id: userLogged.id
                    },
                    order: [['time_of_comment', 'DESC']]
                })

                try {
                    let timeNow = new Date()
                    let lastCommentDate = lastUserComment ? lastUserComment.time_of_comment : null
                    if (lastCommentDate) {
                        diffrenceMinutes = Math.floor((timeNow - lastCommentDate) / (1000 * 60))
                        console.log("diffrence in minutes= " + diffrenceMinutes)
                    } else {
                        diffrenceMinutes = null
                    }

                    if (diffrenceMinutes != null && diffrenceMinutes < 3) {

                        try {
                            let recipeRs = await db.Recipe.findOne({
                                where: {
                                    id: req.params.id
                                },
                                include: [{ association: "comments" }, { association: "ingredients" }, { association: "directions" }, { association: "users" }]
                            })



                            return res.render(`product-detail`, {
                                comments: allComments, recipe: recipeRs, userLogged, allUsers, scrollToComments,
                                errors: {
                                    mustWaitToComment: {
                                        msg: 'Please wait at least 3 minutes before leaving another comment.',
                                    },
                                },
                                //  amountOfReviews, 
                                //  ratingAvg
                            })

                        } catch (error) {
                            console.log('error on rendering after comment added to db: ' + error)
                        }


                    }
                } catch (error) {
                    console.log('there was an error when calculating diff in minuted or inserting data ' + e)
                }

                try {
                    let newComment = {
                        user_comment: req.body.comments,
                        rating: Number(req.body.rate),
                        recipes_id: recipeToComment.id,
                        users_id: userLogged.id,
                    }

                    let createComment = await db.Comment.create(newComment)

                    if (createComment) {
                        try {
                            let recipeRs = await db.Recipe.findOne({
                                where: {
                                    id: req.params.id
                                },
                                include: [{ association: "comments" }, { association: "ingredients" }, { association: "directions" }, { association: "users" }]
                            })

                            return res.render(`product-detail`, {
                                comments: allComments, recipe: recipeRs, userLogged, allUsers, scrollToComments

                            })

                        } catch (error) {
                            console.log('error on rendering after comment added to db: ' + error)
                        }
                    }
                    else {
                        console.log('issue when creating comment or rendering')
                        return res.render('product-detail', {
                            comments: allComments, recipe: recipeToComment, userLogged, allUsers, scrollToComments
                        })
                    }

                } catch (error) {
                    console.log("error at the moment of inserting comment on db= " + error)
                }

            }

        } catch (error) {
            console.log('General error during comment insertion= ' + error)
            return res.render('not-found')
        }


        //Must paginate!

    },
    search: async (req, res) => {

        let filteredProducts = ""

        try {
            // let userLogged = req.session.userLogged.email
            // let allProducts = await db.Recipe.findAll()
            let userSearch = req.body.search
            let allUsers = await db.User.findAll()


            filteredProducts = await db.Recipe.findAll({
                where: {
                    title: {
                        [Op.like]: `%${userSearch}%`
                    }
                },
                include: [{ association: 'users' }]
            })

            if (filteredProducts != null && filteredProducts.length > 0) {
                res.render('product-list', {
                    recipes: filteredProducts, allUsers,
                })
            } else {
                res.render('product-list', {
                    recipes: filteredProducts, allUsers,
                    error: { productNotFound: 'Sorry, nothing to show' }
                })
            }

        } catch (error) {
            console.log('there was an error during the search ' + error)
            res.render('product-list', {
                recipes: filteredProducts, allUsers,
                error: { ErrorDuringSearch: 'Sorry, nothing to show' }
            })
        }
    }
}



async function obtainRecipeAvg(recipeId) {
    let allComentsTotalRatingAvg = 0
    try {

        if (recipeId) {
            let allComments = await db.Comment.findAll({ where: { recipes_id: recipeId } })

            let allCommentsWithRating = await db.Comment.count({
                where: {
                    recipes_id: recipeId,
                    rating: {
                        [db.Sequelize.Op.gt]: 0
                    }
                }
            })

            if (allComments && allComments.length > 0) {

                let allComentsTotalRating = 0

                allComments.forEach(element => {
                    if (element.rating > 0) {
                        allComentsTotalRating += element.rating
                    }
                })

                if (allComentsTotalRating > 0) {
                    allComentsTotalRatingAvg = allComentsTotalRating / allCommentsWithRating
                    console.log("the avg:" + allComentsTotalRatingAvg)
                } else {
                    console.log("No ratings for this recipe")
                }
            } else {
                //   console.log('No commments for this recipe')
            }
        }


        if (allComentsTotalRatingAvg > 0) {
            return allComentsTotalRatingAvg
        }
        else {
            // console.log('There was an error calculating the average')
        }
    } catch (error) {
        console.log('there was an error when trying to obtain rating for recipe ' + recipeId + " error: " + error)
    }
}





async function uploadImgToImgur(req) {
    let recipeImageRs

    if (req.file == null) {
        console.log('No file to upload.')
        return
    }
    else if (req.file != null) {
        try {
            console.log('I am about to try an API call to upload image')
            const imgurResponse = await axios.post('https://api.imgur.com/3/image',
                {
                    'image': req.file.buffer,
                    'album': "8tIaaR9"
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${process.env.myAcessTokenEnv}`,
                    }
                })
            console.log('API call to upload image has been tried')
            recipeImageRs = imgurResponse.data.data.link
        }
        catch (error) {
            console.error('Error uploading image to Imgur:', error)
            //check if error is due to unauthorized, get new token and retry.
            if (error.request && error.request.socket && error.request.socket._rejectUnauthorized == true) {

                console.error('Error uploading img wrong auth, retrying')

                try {
                    const tokens = await getImgurAccesToken(process.env.clientId, process.env.clientSecret, process.env.refreshToken)

                    const imgurResponseFallback = await axios.post('https://api.imgur.com/3/image',
                        {
                            'image': req.file.buffer,
                            'album': "8tIaaR9"
                        },
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${tokens.newAccessToken}`,
                            },
                        })
                    // console.log('this is this: ' + imgurResponseFallback.data.data.link)
                    console.error('Image upload has been retried, result= ' + imgurResponseFallback.data.data.link)

                    return recipeImageRs = imgurResponseFallback.data.data.link

                } catch (fallbackError) {
                    console.log("Error, could not insert image or get a new token " + fallbackError)
                }
            }
        }
        return recipeImageRs
    }
}


// function get token if outdated
async function getImgurAccesToken(clientId, clientSecret, refreshToken) {
    try {

        const data = {
            client_id: encodeURIComponent(clientId),
            client_secret: encodeURIComponent(clientSecret),
            refresh_token: encodeURIComponent(refreshToken),
            grant_type: 'refresh_token',
        }

        const response = await axios.post('https://api.imgur.com/oauth2/token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        const newAccessToken = response.data.access_token
        const newRefreshToken = response.data.refresh_token

        // You can return the tokens or perform other actions as needed.
        return { newAccessToken, newRefreshToken }
    } catch (error) {
        console.error('Error obtaining access token:', error.message)
        throw error // Re-throw the error for the caller to handle if needed.
    }
}