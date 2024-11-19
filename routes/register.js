const express = require('express');
const express = require('express');
const router = express.Router();
const users = require('../data/user');
const error = require('../utilities/error');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res, next) => {
    const { username, password } = req.body;

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return next(error(400, 'Username already taken.'));
    }

    users.push({ username, password });
    res.redirect('/login');
});

module.exports = router;