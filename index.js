const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true
}));

const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

app.use('/auth', authRoutes);
app.use('/todos', checkAuth, todoRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.use((req, res, next) => {
    next(error(404, "Resource Not Found"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});