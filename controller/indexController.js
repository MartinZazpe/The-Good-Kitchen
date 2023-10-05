var fs = require('fs')
var path = require('path')


//for MYSQL db
const db = require('../database/models')
const Op = db.Sequelize.Op



module.exports = {
    indexAndRecents: async (req, res) => {
        try {
            let recentUploads = await db.Recipe.findAll({
                limit: 4,
                order: [['createdAt', 'DESC']],
                include: [{ association: "users" }]
            })

            // Fetch all users from the database
            const allUsers = await db.User.findAll()

            let allRecipes = await db.Recipe.findAll()

            let latestRecipes = 0

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

            //keep only the ones not null and ranked.
            recipeRatings = recipeRatings.filter(rating => rating !== null && rating.ratingAvg !== 0)

            try {
                latestRecipes = await db.Recipe.findAll({
                    order: [['createdAt', 'DESC']],
                    limit: 4
                })
            } catch (error) {
                console.log('could not get latest recipes')
            }

            res.render("index", {
                recipes: latestRecipes, allUsers, recentUploads, recipeRatings
            })

        } catch (err) {
            console.error("error fetching data for index")
            res.status(500).send('Internal server error ' + err)
        }
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
            //console.log('There was an error calculating the average')
        }
    } catch (error) {
        console.log('there was an error when trying to obtain rating for recipe ' + recipeId + " error: " + error)
    }
}