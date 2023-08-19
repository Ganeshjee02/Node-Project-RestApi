
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken')
exports.findMe = async (req, res) => {
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    var decoded = jwt.verify(token, 'password', function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        return decoded
    });
    const data = await User.findOne({ email: decoded.email }, { password: 0 }).exec();
    res.status(200).send(data);

}