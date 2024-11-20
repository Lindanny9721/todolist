const express = require('express');
const router = express.Router();
const lists = require('../data/todo');

router.get('/', (req, res) => {
    const todos = lists;
    const user = req.session.user;
    const priority = req.query.priority;
    let filter = todos;
    if (priority) {
        filter = todos.filter(todo => todo.priority === priority);
    }
    res.render('todo', { todos: filter, priority, user }); 
});

router.post('/add', (req, res) => {
    const { task, priority } = req.body;    
    if (task) {
        lists.push({id: lists.length, task, completed: false, priority });
    }
    res.redirect('/todos');
});

router.delete('/delete/:index', (req, res) => {
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
        const { task, priority } = req.body;
        if (index >= 0 && index < lists.length) {
            if (task) {
                lists[index].task = task;
            }
            if (priority) {
                lists[index].priority = priority;
            }
        }
    res.redirect('/todos');
});

module.exports = router;