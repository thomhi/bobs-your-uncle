const mongoose = require('mongoose');

const answerCardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: String,
});

module.exports = mongoose.model('AnswerCard', answerCardSchema, 'answerCards');