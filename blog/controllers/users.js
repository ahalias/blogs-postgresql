const userRouter = require('express').Router()
require('express-async-errors')


const { User, Blog, Reading } = require('../models/')

userRouter.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.status(201).json(users)
})

userRouter.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.status(201).json(user)

})

userRouter.get('/:id', async (req, res) => {

    if (Number(req.params.id)) {
    const user = await User.findByPk(
        Number(req.params.id),{
            attributes: ['name', 'username'],
            include: [
                {
                    model: Reading,
                    as: 'readings',
                    attributes: { include: ['read', 'blogId', 'id'],
                     exclude: ['userId', 'createdAt', 'updatedAt']},
                    
                    
                },
                
            ],
            
        })
        if (user)
        {

            const formattedUser = {
                name: user.name,
                username: user.username,
                readings: (await Promise.all(user.readings.map(async (reading) => {
                  let read = reading.read;
                  let readingId = reading.id;
              
                  if ( !req.query.read || req.query.read === read.toString()) {
                    const blog = await Blog.findByPk(reading.blogId, {});
              
                    return {
                      id: blog.id,
                      url: blog.url,
                      title: blog.title,
                      author: blog.author,
                      likes: blog.likes,
                      year: blog.year,
                      readinglists: {
                        read: read,
                        id: readingId
                      },
                    };
                  } else {
                    return null;
                  }
                }))).filter(entry => entry !== null),
              };
              
        res.status(201).json(formattedUser)
        } else {
            res.status(404).end()

        }
    res.status(201).json(formattedUser)
} else {
    const username = req.params.id;
  
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
  
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).end();
    }
}
})

  

userRouter.put('/:username', async (req, res) => {
    const username = req.params.username;
  
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    user.username = req.body.username
    await user.save()
    res.status(201).json(user)
})


module.exports = userRouter