const blogRouter = require('express').Router()
const { Blog, User } = require('../models')
require('express-async-errors')
const { SECRET } = require('../utils/config')
const { Op } = require('sequelize');
const tokenExtractor = require('../utils/tokenExtractor')



const blogFinder = async (req, res, next) => {
req.blog = await Blog.findByPk(Number(req.params.id))
next()
}




blogRouter.get('/', async (req, res) => {

    const where = {}
    if (req.query.search) {
        const query = req.query.search
        {
            where[Op.or] = [
            {
                title: {
                [Op.iLike]: `%${query}`
              }
            },
             { 
                author: {
                  [Op.iLike]: `%${query}`
                }
            }
        ]
    }
        
      }

      const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
          model: User,
          attributes: ['name']
        },
        where,
        order: [
            ['likes', 'DESC']
        ]
      });
      res.status(201).json(blogs);
  });
 
  blogRouter.post('/', tokenExtractor, async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
        res.status(201).json(blog)
  })

  blogRouter.get('/:id', blogFinder, async (req, res) => {
      res.status(201).json(req.blog)
    
  })

  blogRouter.delete('/:id',tokenExtractor, blogFinder, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user || (user.id !== req.blog.userId)) {
        return res.status(401).json({ error: 'token missing' })
    }
        req.blog.destroy()
        res.status(204).end()
  })

  blogRouter.put('/:id', blogFinder, async(req, res) => {

        req.blog.likes = req.body.likes
        await req.blog.save()
        res.status(201).json(req.blog)
  })



  module.exports = blogRouter