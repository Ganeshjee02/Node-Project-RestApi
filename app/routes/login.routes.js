module.exports = (app) => {
    const Login = require('../controllers/login.controller.js');
    const { check } = require('express-validator');

    // Create a new users
    app.post('/login', [
        check('email', 'Your email is not valid').isEmail(),

        check('password').exists()
            .withMessage('Password should not be empty, minimum eight characters, at least one letter, one number and one special character')
            .isLength({ min: 8 })
            .withMessage('minimum eight characters')

    ], Login.create);
}