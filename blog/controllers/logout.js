const logoutRouter = require('express').Router()



logoutRouter.get('/',(req,res) => {
    req.session.destroy();
    res.status(200).send('Logged out successfully')
});


module.exports = logoutRouter