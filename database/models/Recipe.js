module.exports = (sequelize, dataTypes) => {

    let alias = "Recipe"
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: dataTypes.STRING,
            allowNull: false
        },
        description: {
            type: dataTypes.STRING(500),
            allowNull: false
        },
        image: {
            type: dataTypes.STRING,
            allowNull: false
        },
        ratingAVG: {
            type: dataTypes.INTEGER
        }
    }
    let config = {
        tableName: "recipes",
        timestamps: false
    }

    const Recipe = sequelize.define(alias, cols, config)


    Recipe.associate = function (models) {
        Recipe.belongsTo(models.User, {
            as: "users",
            foreignKey: "user_id"
        })
        Recipe.hasMany(models.Comment, {
            as: "comments",
            foreignKey: "recipes_id"
        })
        Recipe.hasMany(models.RecipeIngredients, {
            as: "ingredients",
            foreignKey: "recipes_id"
        }),
            Recipe.hasMany(models.Directions, {
                as: "directions",
                foreignKey: "recipes_id"
            })


    }

    return Recipe
}


//Falta la foreign key