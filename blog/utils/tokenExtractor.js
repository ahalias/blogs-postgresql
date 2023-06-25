const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')



const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    const session=req.session
    if (!session.userid) {
        return res.status(401).json({ error: 'session expired' })
    }
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)

      } catch{
        return res.status(401).json({ error: 'token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }


  module.exports = tokenExtractor