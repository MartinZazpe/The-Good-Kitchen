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


            // Fetch the two best-ranked recipes from the database
            const twoBestRanked = await db.Recipe.findAll({
                limit: 5,
                where: {
                    ratingAvg: 5,
                },
                order: [['createdAt', 'DESC']], // Adjust the order as needed
            })
            res.render("index", {
                recipes: recentUploads, allUsers, twoBestRanked
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


