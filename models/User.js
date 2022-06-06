
// editar la información de un usuario
// eliminar a un usuario de la DB

//asi como tengo findByField que devuelve el primero que corresponda, podria tener uno que devuelva todos los usuarios (o productos) que coincidan


const fs = require('fs')
var path = require('path')
let bcrypt = require('bcryptjs')


const User = {
    fileName: './data/users.json',
    getData: function () {
        return JSON.parse(fs.readFileSync(this.fileName, 'utf-8'))
    },

    findAll: function () {
        return this.getData()
    },

    generateId: function () {
        let allUsers = this.findAll()
        let lastUser = allUsers.pop()
        if (lastUser) {
            return lastUser.id + 1
        }
        return 1
    },

    findByPk: function (id) {
        let allUsers = this.findAll()
        let userFound = allUsers.find(user => user.id === id)
        return userFound
    },
    findByField: function (field, text) {
        let allUsers = this.findAll()
        let userFound = allUsers.find(user => user[field] === text)
        return userFound
    },
    create: function (userData) {
        let allUsers = this.findAll()
        let newUser = {
            id: this.generateId(),
            ...userData
        }
        allUsers.push(newUser)
        fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null, 4))
        return newUser
    },
    delete: function (id) {
        let allUsers = this.findAll()
        let finalUsers = allUsers.filter(oneUser => oneUser.id !== id)
        fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, 4))
        return true
    },
}

module.exports = User



