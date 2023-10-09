const { UPSERT } = require("sequelize/types/query-types")
let db = require("./database/models")
const Op = db.Sequelize.Op



/* db.Recipe.findAll({
    where: { title: { [db.Sequelize.Op.like]: '%choco%' } }
}
).then((result) => {
    console.log(result)
})

db.Producto.findAll({ limit: 5 }).then((result) => {
    console.log(result)
}) */

module.exports = (sequelize, dataTypes) => {

    let alias = "productos"
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: dataTypes.VARCHAR(200),
        descripcion: dataTypes.TEXT,
        precio: dataTypes.DECIMAL
    }
    let config = {
        tableName: "productos",
        timestamps: false,
    }

    const productos = sequelize.define(alias, cols, config)

    return productos
}



module.exports = {

    findByPk: (req, res) => {
        db.Product.findByPk(req.params.id).then((result) => {
            res.send(result)
        }).catch(error => {
            // console.log(error)
        })
    },
    consultaDatos: (req, res) => {
        db.Product.findAll({ where: { 'precio': { [Op.gte]: 50000 } }, order: [['nombre', 'ASC']], limit: 10 })
            .then((result) => {
                return result
            })
    }
}


module.exports = (sequelize, dataTypes) => {

    const alias = 'Pelicula'
    const cols = {
        id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true
        }
    }
    let config = {
        timestamps: false,
        tableName: 'Pelicula'
    }

    const Pelicula = sequelize.define(alias, cols, config)

    Pelicula.associate = (modelos) => {
        Pelicula.belongsTo(modelos.Generos, {
            as: "peliculas",
            foreignKey: "genre_id"
        })
    }




    return Pelicula

}


Genero.associate = (models) => {
    Genero.hasMany(models.Peliculas, {
        as: 'Peliculas',
        foreignKey: 'generos_id'
    })
}

traerPeli: (req, res) => {

    db.Pelicula.findByPk(req.params.id, { include: ['genero'] }).then((result) => {
        // console.log(pelicula.genero.nombre)
    })


}
createProduct: (req, res) => {
    db.Producto.create({
        nombre: 'Falcon 9',
        creador: {
            nombre: 'Elon',
            apellido: 'Musk'
        }
    }, { include: [Creador] })
}



Pelicula.belongsToMany('Actor', {

    as: "actores",
    through: "PeliculaActor",
    foreignKey: 'pelicula_id',
    otherKey: 'actor_id',
    timestamps: false,

})



db.Peliculas.findByPk(1, { include: ['actores'] }).then((resultado) => {
    // console.log(resultado.actores)
})

Pelicula.setActores([3, 5, 8])



productos.associate = (models) => {

    models.productos.belongsTo(models.Marcas, {
        as: 'brand',
        foreignKey: 'marca_id'
    })
}



brand.associate = (models) => {
    models.brand.hasMany(models.Productos, {
        as: 'products',
        foreignKey: 'marca_id'
    })
}



Product.associate = (models) => {

    models.Product.belongsToMany('Colors', {
        as: 'colors',
        through: 'colores_productos',
        foreignKey: 'products_id',
        otherKey: 'colors_id',
        timestamps: false,
    })
}



const controller = {
    index: (req, res) => {
        db.Product
            .findAll({
                include: [{ as: 'colors' }, { as: 'brand' }]
            }
            )
            .then(productos => {
                res.send(productos)
            })
            .catch(err => {
                res.send(err)
            })
    }
}