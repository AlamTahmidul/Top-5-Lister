const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String, required: true },
        username: { type: String },
        views: {type: Number},
        likes: { type: [String] },
        dislikes: {type: [String] },
        isPublished: {type: Boolean}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
