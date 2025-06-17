const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware')

router.get('/', authMiddleware, (req, res) => {

    const {id, username, role} = req.userInfo 

    res.json({
        success: true,
        message: 'Welcome to the home Page',
        user: {
            _id: id,
            username,
            role
        }
    });
})

module.exports = router;