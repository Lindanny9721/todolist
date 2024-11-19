const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        console.log(method,req.body._method)
        delete req.body._method
        return method
    }
}))
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