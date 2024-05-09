const express = require('express');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.get('/', userController.getHomepage);
router.get('/share', userController.getShare);

module.exports = router;