const express = require('express');
const authController = require('../controllers/auth-controller')

const router = express.Router();

router.get('/sign-up', authController.getSignUp);
router.get('/sign-in', authController.getSignIn);
router.get('/reset', authController.getResetPassword);
router.post('/sign-up', authController.postSignUp);
router.post('/sign-in', authController.postSignIn);
router.post('/logout', authController.postLogout);
router.post ('/reset', authController.postResetPassword);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);


module.exports = router