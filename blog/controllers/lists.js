const { Reading, User } = require('../models');
const tokenExtractor = require('../utils/tokenExtractor');

const listsRouter = require('express').Router()

listsRouter.post('/', async (req, res) => {
    const { blogId, userId } = req.body;
    const readingList = await Reading.create({ blogId, userId });
    res.json(readingList);
  });


  listsRouter.get('/', async (req, res) => {
    const lists = await Reading.findAll()
    res.json(lists)
  })

  listsRouter.put('/:id', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (user) {
        const userList = await Reading.findByPk(req.params.id)
        userList.read = req.body.read
        userList.save()
        res.status(201).send(userList)
    } else {
        res.status(404).send("List not found")
    }
  })



module.exports = listsRouter