require('dotenv').config()

module.exports = {
  "development": {
    "username": process.env.mysqluser,
    "password": process.env.mysqlpass,
    "database": "recipes_db",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "test": {
    "username": process.env.mysqluser,
    "password": process.env.mysqlpass,
    "database": "recipes_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.mysqluser,
    "password": process.env.mysqlpass,
    "database": "recipes_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
