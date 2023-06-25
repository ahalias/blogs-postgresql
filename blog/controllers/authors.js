const authorRouter = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../utils/db')
require('express-async-errors')



authorRouter.get('/', async (req, res) => {
    const authors = await Blog.findAll({ 
        attributes: [
            'author', 
            [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
        ],
        group: 'author',
        order: [
            ['likes', 'DESC']
        ]

    })

    res.status(201).json(authors)
})



module.exports = authorRouter