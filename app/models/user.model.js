const mongoose = require('mongoose');

const UaerSchema = mongoose.Schema({
    firstName: { type: String, required: true, trim: true, unique: true },
    lastName: String,
    phone: Number,
    email: { type: String, unique: true, lowercase: true, required: true, trim: true },
    address1: String,
    address2: String,
    dob: Date,
    password: { type: String, required: true, trim: true, unique: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UaerSchema);