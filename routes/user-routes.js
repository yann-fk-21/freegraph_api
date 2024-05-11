const express = require('express');
const userController = require('../controllers/user-controller');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', userController.getHomepage);
router.get('/share', isAuth, userController.getShare);
router.post('/share', isAuth, userController.postShare);

module.exports = router;