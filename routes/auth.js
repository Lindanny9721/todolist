const express = require('express');
const router = express.Router();
const users = require('../data/user');
const error = require('../utilities/error');

router
    .route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res, next) => {
    const { username, password } = req.body;
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return next(error(400, 'Username already taken.'));
    }
    users.push({ username, password });
    res.redirect('/auth/login');
});

router
    .route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res, next) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user) {
        return next(error(404, 'User not found'));
    }
    if (user.password !== password) {
        return next(error(404, 'Wrong Password!'));
    }
    req.session.user = username;
    res.redirect('/todos');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return next(error(500, 'Error logging out'));
        }
            res.redirect('/auth/login');
        });
});

module.exports = router;