const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    content: { type: String, required: true },
});
module.exports = model('Comment', commentSchema);
