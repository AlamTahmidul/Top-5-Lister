const express = require('express');
const router = express.Router();
const auth = require('../auth');
const Top5ListController = require('../controllers/top5list-controller');
const CommentController = require('../controllers/comment-controller');

router.post('/top5list', auth.verify, Top5ListController.createTop5List);
router.delete('/top5list/:id', auth.verify, Top5ListController.deleteTop5List);
router.get('/top5list/:id', auth.verify, Top5ListController.getTop5ListById);
router.get('/top5listpairs', auth.verify, Top5ListController.getTop5ListPairs);
router.get('/top5lists', Top5ListController.getTop5Lists);
router.put('/top5list/:id', auth.verify, Top5ListController.updateTop5List);

/* For Comments */
router.post('/top5list/:listid/comment', auth.verify, CommentController.createComment);
router.get('/top5list/:listid/comments', CommentController.getCommentsByList);
router.delete('/top5list/:listid/comment/:commentid', auth.verify, CommentController.deleteComment);

module.exports = router;