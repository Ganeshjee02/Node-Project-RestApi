
const User = require('../models/user.model.js');
const { validationResult } = require('express-validator');
const Bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

// Create and Save a new User
exports.create = async (req, res) => {

  // Validate request
  const errors = await validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((res) => {
        let obj = {};
        obj[res.param] = res.msg
        return obj;
      })
    })
  }

  const data = await User.findOne({ email: req.body.email }, { password: req.body.password }).exec();
  if (!data) {
    return res.status(400).json({ errors: [{ email: "email not registered" }] })
  }
  if (!Bcrypt.compareSync(req.body.password, data.password)) {
    return res.status(400).send({ message: "The password is invalid" });
  }
  else {
    let token = jwt.sign({ email: req.body.email },
      'password',
      {
        expiresIn: '24h' // expires in 24 hours
      }
    );
    res.status(200).send({ auth: true, message: 'Authentication successful!', token: token });
  }



};