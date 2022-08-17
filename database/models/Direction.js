module.exports = (sequelize, dataTypes) => {

    let alias = "Directions"
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        direction: {
            type: dataTypes.STRING
        }
    }
    let config = {
        tableName: "recipe_directions",
        timestamps: false
    }

    const Directions = sequelize.define(alias, cols, config)


    Directions.associate = function (models) {
        Directions.belongsTo(models.Recipe, {
            as: "recipe",
            foreignKey: "recipes_id"
        })
    }

    return Directions
}