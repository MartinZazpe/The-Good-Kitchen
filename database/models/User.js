module.exports = (sequelize, dataTypes) => {

    let alias = "User"
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        email: {
            type: dataTypes.STRING,
            allowNull: false
        },
        password: {
            type: dataTypes.STRING,
            allowNull: false
        },
        image: {
            type: dataTypes.STRING
        },
        user_type_id: {
            type: dataTypes.INTEGER
        }
    }
    let config = {
        tableName: "users",
        timestamps: false
    }

    const User = sequelize.define(alias, cols, config)

    User.associate = function (models) {
        User.hasMany(models.Recipe, {
            as: "recipes",
            foreignKey: "user_id",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        User.hasMany(models.Comment, {
            as: "comments",
            foreignKey: "users_id"
        })

    }


    return User
}


//falta foreign key
