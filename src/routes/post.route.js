const route = require('express').Router();
const postCtrl = require('../controller/post.controller');
const {upload}= require('../middleware/fileUpload');

route.post('/crate-post',upload.single('file'),postCtrl.createPost);

route.get('/getAll/user-post',postCtrl.getUserAllPosts);

route.get('/getAll/post',postCtrl.getAllPosts);

route.get('/get-post/:postId',postCtrl.getPostById);

route.post('/like-post/:postId',postCtrl.likePost);

route.post('/add-comment/:postId',postCtrl.commentPost);

route.delete('/delete-comment/:postId',postCtrl.deletePostComments);

route.delete('/delete-post/:postId',postCtrl.deletePost);



module.exports = {postRoutes : route}