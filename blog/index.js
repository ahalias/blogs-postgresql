const express = require('express')
const app = express()
require('dotenv').config()
const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize');


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: false // Set SSL to false
  }
})

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query("CREATE TABLE IF NOT EXISTS blogs ( id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes Integer default 0 );", { type: QueryTypes.SELECT })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()

class Blog extends Model {}
 Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    devaultValue: 0
  },
}, 
{
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

app.use(express.json())


app.get('/api/blogs', async (req, res) => {
    try {
      const blogs = await Blog.findAll();
      res.json(blogs);
    } catch (error) {
      console.error('Error retrieving blogs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
 
  app.post('/api/blogs', async (req, res) => {
    try {
      const blog = await Blog.create(req.body)
      res.status(201).json(blog)
    } catch(error) {
      console.error('Error creating blog:', error);
      res.status(400).json({error});
    }
  })

  app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(Number(req.params.id))
    if (!blog) {
      res.status(404).json({error: "Blog doesn't exit"})

    } else {
      res.status(201).json(blog)
    }
  })

  app.delete('/api/blogs/:id', async (req, res) => {

      const blog = await Blog.destroy({where: {id: Number(req.params.id)}})
      if (!blog) {
        res.status(404).json({error: "Blog doesn't exit"})
      } else {
        res.status(204).send()
      }

    

  })



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})