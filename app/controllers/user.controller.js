const User = require('../models/user.model.js');
const { validationResult } = require('express-validator');
const Bcrypt = require("bcryptjs");
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

    const data = await User.find({ email: req.body.email }).then(users => users)
    if (data.length > 0) {
        return res.status(422).json({ errors: [{ email: "email is already registered" }] })
    }

    // Create a User
    const user = new User({
        firstName: req.body.firstName || "Untitled Note",
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        address1: req.body.address1,
        address2: req.body.address2,
        dob: req.body.dob,
        password: await Bcrypt.hashSync(req.body.password, 10)
    });
    // Save User in the database
    user.save()
        .then(data => {
            res.send({
                message: "user creat succesfull"
            });
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        });
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
    let limit = Number(req.params.limit);
    let pageNo = Number(req.params.pageNo)

    let obj = { data: {}, count: Number, pageNo: Number }
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    User.count().then((count) => {
        obj.count = count;
        obj.pageNo = Math.ceil(obj.count / limit)
        if (obj.pageNo < pageNo) {
            response = { "error": true, "message": "invalid page number" };
            return res.json(response)
        }
    
        User.find({},{'password':0}).limit(limit).skip(pageNo).sort({"firstName":-1})//sort with -1 in desc and 1 acend
            .then(users => {
                obj.data = users

                res.send(obj)
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving notes."
                });
            });

    });



};

// Find a single User with a UserId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.userId
            });
        });
};

exports.update = (req, res) => {
    // Validate Request
    // Validate request
    if (!req.body.firstName && !req.body.lastName && !req.body.email) {
        return res.status(400).send({
            message: "Note firstName , lastName and email can not be empty"
        });
    }


    // Find User and update it with the request body
    User.findByIdAndUpdate(req.params.userId,
        {
            firstName: req.body.firstName || "Untitled Note",
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            address1: req.body.address1,
            address2: req.body.address2,
        }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating User with id " + req.params.userId
            });
        });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete User with id " + req.params.userId
            });
        });
};

exports.serch =(req,res) => {

    User.find({firstName:{$regex: req.params.serchdata,$options:'i'}},{'password':0})
    .then(user=>{

        if (!user) {
            return res.status(404).send({
                message: "User not found with id "
            });
        }
        res.send(user);
    }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " 
            });
        }
        return res.status(500).send({
            message: "Could not delete User with id " 
        });
    });

}