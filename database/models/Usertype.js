module.exports = (sequelize, dataTypes) => {

    let alias = "Usertype"
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING(45),
            unique: true,
        }
    }
    let config = {
        tableName: "user_type",
        timestamps: false
    }

    const Usertype = sequelize.define(alias, cols, config)





    return Usertype
}
