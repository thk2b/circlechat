const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const Sequelize = require('sequelize')

const config = require('../config')
const db = {}

const sequelize = new Sequelize(config.dbUrl, { dialect: 'postgres' })

fs
  	.readdirSync(__dirname)
  	.filter(file => {
    	return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  	})
  		.forEach(file => {
   	const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  });

Object.keys(db).forEach(modelName => {
	db[modelName].sync() // TODO: do in migrations
  	if (db[modelName].associate) {
    	db[modelName].associate(db)
  	}
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db