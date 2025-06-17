const express = require('express');

const router = express.Router();
const {registerUser, loginUser, changePassword} = require('../controllers/auth-controller');
const authMiddleware= require('../middlewares/auth-middleware')
//register
router.post('/register', registerUser);

//login
router.post('/login', loginUser);

//change password
router.post('/change-password',authMiddleware, changePassword)

module.exports = router;
