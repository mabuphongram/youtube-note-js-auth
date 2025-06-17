const express = require('express')
const router = express.Router()
const isAdminUser = require('../middlewares/admin-middleware')
const authMiddleware = require('../middlewares/auth-middleware')

router.get('/welcome', authMiddleware, isAdminUser, (req,res)=> {
    res.json({
        message: "Welcome to Admin Page"
    })
})

module.exports = router