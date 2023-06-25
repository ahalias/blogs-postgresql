const express = require('express')
const app = express()
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const middleware = require('./utils/middleware')
const authorRouter = require('./controllers/authors')
const listsRouter = require('./controllers/lists')


const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const logoutRouter = require('./controllers/logout')
app.use(express.json())


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false,
  
}));



app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', listsRouter)
app.use('/api/logout', logoutRouter)



app.use(middleware.unknownEndpoint)


app.use(middleware.errorHandler)




const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()