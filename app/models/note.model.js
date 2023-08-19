const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const NoteSchema = mongoose.Schema({
    title: String,
    content: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);