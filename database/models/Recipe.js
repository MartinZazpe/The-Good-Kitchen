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
        }
    }
    let config = {
        tableName: "recipes",
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false
    }

    const Recipe = sequelize.define(alias, cols, config)





    Recipe.associate = function (models) {
        Recipe.belongsTo(models.User, {
            as: "users",
            foreignKey: "user_id",
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE',
        })
        Recipe.hasMany(models.Comment, {
            as: "comments",
            foreignKey: "recipes_id",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',

        })
        Recipe.hasMany(models.RecipeIngredients, {
            as: "ingredients",
            foreignKey: "recipes_id",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',

        }),
            Recipe.hasMany(models.Directions, {
                as: "directions",
                foreignKey: "recipes_id",
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })


    }

    return Recipe
}


//Falta la foreign key