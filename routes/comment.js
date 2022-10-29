const Comment = require('../model/comment');
const { CallbackModel } = require('../util')

    async create(ctx) {
        try {
            const data = await new Comment({...ctx.request.body }).save();
            CallbackModel(ctx, 200, 'Comment successfully created', data)
        } catch (error) {
            CallbackModel(ctx, 500, 'error', JSON.stringify(error))
        }
    }

