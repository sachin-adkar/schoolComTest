const express = require('express');
const router = express.Router();
const User = require('./user');

router.post('/register', User.register);
router.post('/login', User.login);
router.get('/users', User.listUsers);
router.get('/validate', User.validate);

module.exports = router;
