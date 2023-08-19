module.exports = (app) => {
    const Me = require('../controllers/me.controller.js');
    app.get('/me', Me.findMe);
}