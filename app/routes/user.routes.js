module.exports = (app) => {
  const users = require('../controllers/user.controller.js');
  const { check } = require('express-validator');

  // Create a new users
  app.post('/users', [
    check('firstName').isLength({ min: 3 }),
    check('email', 'Your email is not valid').isEmail(),
    check('password', 'Password Required').isLength({ min: 8 }),
    check('phone', "phone must be in number and 10 degit").isMobilePhone().isLength({ min: 10, max: 10 })
  ], users.create);

  // Retrieve all users
  app.get('/users/:limit?/:pageNo?', users.findAll);

  // Retrieve a single Note with noteId
  app.get('/users1/:userId', users.findOne);

  // Update a Note with userId
  app.put('/users/:userId', users.update);

  // Delete a Note with userId
  app.delete('/users/:userId', users.delete);

  app.get('/usersSerch/:serchdata?', users.serch);
}