const express = require('express');
const authController = require('../controllers/auth-controller')

const router = express.Router();

router.get('/sign-up', authController.getSignUp);
router.get('/sign-in', authController.getSignIn);
router.post('/sign-up', authController.postSignUp);



module.exports = router