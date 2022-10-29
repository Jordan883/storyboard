const Comment = require('../model/comment');

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

async create(ctx) {
    try {
        const data = await new Comment({...ctx.request.body }).save();
        let CallbackModel = new Utils(ctx, 200, 'Comment successfully created', data);
    } catch (error) {
        let CallbackModel = new Utils(ctx, 500, 'Error', JSON.stringify(error));
    }
}
