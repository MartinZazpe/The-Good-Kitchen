module.exports = (sequelize, dataTypes) => {

    let alias = "Comment"
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_comment: {
            type: dataTypes.STRING,
            allowNull: false
        },
        rating: {
            type: dataTypes.INTEGER,
        },
        time_of_comment: {
            type: dataTypes.DATE,
        }
    }
    let config = {
        tableName: "comments",
        timestamps: false
    }

    const Comment = sequelize.define(alias, cols, config)

    Comment.associate = function (models) {
        Comment.belongsTo(models.Recipe, {
            as: "recipes",
            foreignKey: "recipes_id",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Comment.belongsTo(models.User, {
            as: "users",
            foreignKey: "users_id"
        })
    }
    return Comment
}

