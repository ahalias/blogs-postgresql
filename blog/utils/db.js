const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { QueryTypes } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')


const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: false // Set SSL to false
    }
  })


  const connectToDatabase = async () => {
    try {
      await sequelize.authenticate()
      await runMigrations()
      console.log('Connection has been established successfully.')
    } catch (error) {
      console.error('Unable to connect to the database:', error)
      return process.exit(1)
    }

    return null
  }

  const migrationConf = {
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  }
    
  const runMigrations = async () => {
    const migrator = new Umzug(migrationConf)
    const migrations = await migrator.up()
    console.log('Migrations up to date', {
      files: migrations.map((mig) => mig.name),
    })
  }
  const rollbackMigration = async () => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConf)
    await migrator.down()
  }
  
  module.exports = { connectToDatabase, sequelize, rollbackMigration }