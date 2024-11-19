const express = require('express');
const router = express.Router();
const lists = require('../data/todo');

router.get('/', (req, res) => {
    const todos = lists;
    const user = req.session.user;
    res.render('todo', { todos, user });  
});

router.post('/add', (req, res) => {
    const { task } = req.body;
    if (task) {
        lists.push({ task, completed: false });
    }
    res.redirect('/todos');
});

router.get('/delete/:index', (req, res) => {
    const { index } = req.params;
    if (index >= 0 && index < lists.length) {
        lists.splice(index, 1);
    }
    res.redirect('/todos');
});
router
    .route('/edit/:index')
    .get((req, res) => {
        const { index } = req.params;
        const todo = lists[index];
        if (todo) {
            res.render('edit', { todo, index });
        } else {
            res.redirect('/todos');
        }
    })
    .post((req, res) => {
        const { index } = req.params;
        const { task } = req.body;
        if (index >= 0 && index < lists.length) {
            if (task) {
                lists[index].task = task;
            }
        }
    res.redirect('/todos');
});

module.exports = router;