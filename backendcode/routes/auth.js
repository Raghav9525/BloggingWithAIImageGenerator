
const express = require('express')
const router = express.Router();
const blogControllers =  require('../controllers/auth')


router.post('/login', blogControllers.login);
router.post('/signup', blogControllers.signup);

module.exports = router;
