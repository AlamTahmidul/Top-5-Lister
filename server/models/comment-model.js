const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema(
    {
        listId: { type: ObjectId, ref: 'Top5List', required: true },
        owner: { type: ObjectId, ref: 'User', required: true },
        content: { type: String, required: true }
    }, {timestamps: true},
);

module.exports = mongoose.model('Comment', CommentSchema);