module.exports = (sequelize, dataTypes) => {

    let alias = "RecipeIngredients"
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ingredient: {
            type: dataTypes.STRING(400),
            allowNull: false
        }
    }
    let config = {
        tableName: "recipe_ingredients",
        timestamps: false
    }

    const RecipeIngredients = sequelize.define(alias, cols, config)

    RecipeIngredients.associate = function (models) {
        RecipeIngredients.belongsTo(models.Recipe, {
            as: "recipe",
            foreignKey: "recipes_id",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return RecipeIngredients
}