const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String, required: true },
        username: { type: String },
        views: {type: Number},
        likes: { type: Number },
        dislikes: { type: Number},
        isPublished: {type: Boolean},
        comments: [{ type: ObjectId, ref: 'Comment' }]
    },
    { timestamps: true },
);

module.exports = mongoose.model('Top5List', Top5ListSchema);
