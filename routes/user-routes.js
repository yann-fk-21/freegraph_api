const express = require('express');

const userController = require('../controllers/user-controller');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', userController.getHomepage);

router.get('/share', isAuth, userController.getShare);

router.get('/edit-post/:postId', isAuth, userController.getPost);

router.post('/share', isAuth, userController.postShare);

router.post('/edit-post', isAuth, userController.editPost);

router.post('/delete/:postId', isAuth, userController.postDelete);

module.exports = router;