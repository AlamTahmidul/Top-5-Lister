const Comment = require('../models/comment-model');

module.exports.createComment = async (req, res) => {
    const newComment = new Comment({ listId: req.params.listid, owner: req.userId , content: req.body.content });
    newComment.save().then(comment => {
        return res.status(200).json({ success: true, comment: comment });
    }).catch(err => res.status(500).json({ success: false, error: err }));
};

module.exports.getCommentsByList = async (req, res) => {
    const comments = await Comment.find({ listId: req.params.listid }).skip(req.body.next || 0).limit(20);
    return res.status(200).json({ success: true, comments: comments })
};

module.exports.deleteComment = async (req, res) => {
    // listid and commentid
    await Comment.findOneAndDelete({ _id: req.params.commentid, listId: req.params.listid, owner: req.userId }, (err, comment) => {
        if (err) return res.status(400).json({ success: false, error: "Invalid Comment/User/List" });
        return res.status(200).json({ success: true, comment: comment });
    }).catch(err => res.status(500).json({ success: false, error: err }));
};