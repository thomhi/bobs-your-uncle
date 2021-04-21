const mongoose = require('mongoose');

const questionCardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: String,
    numberOfFields: Number,
});

module.exports = mongoose.model('QuestionCard', questionCardSchema, 'questionCards');