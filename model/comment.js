const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    content: { type: String, required: true },
});
module.exports = model('Comment', commentSchema);

class Utils {
    CallbackModel(ctx, status, message, data) {
        ctx.response.status = status;
        ctx.body = {
            code: status,
            message: message,
            data: data,
        };
    }
}

module.exports = new Utils;
