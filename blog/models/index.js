const Blog = require('./blog')
const Reading = require('./list')
const User = require('./user')



User.hasMany(Blog)
Blog.belongsTo(User)
User.belongsToMany(Blog, { through: Reading, as: 'readings' })
Blog.belongsToMany(User, { through: Reading, as: 'readingUsers' })
User.hasMany(Reading)
Reading.belongsTo(User)
Blog.hasMany(Reading)
Reading.belongsTo(Blog)







module.exports = {
  Blog,
  User,
  Reading,
}