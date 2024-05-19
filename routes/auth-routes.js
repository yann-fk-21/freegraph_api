const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth-controller')

const router = express.Router();

router.get('/sign-up', authController.getSignUp);
router.get('/sign-in', authController.getSignIn);
router.get('/reset', authController.getResetPassword);
router.post('/sign-up', [body('email').isEmail().withMessage('Email is invalid')], authController.postSignUp);
router.post('/sign-in', [body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({min: 5}).withMessage('Length of password is not suffisent')
], authController.postSignIn);
router.post('/logout', authController.postLogout);
router.post ('/reset', authController.postResetPassword);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);


module.exports = router