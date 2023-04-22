import express from "express";
const router = express.Router();
import Post from '../../models/Post.js';
import User from '../../models/User.js';
import Comment from "../../models/Comment.js";
import { protect } from "../../middleware/index.js";

//CREATE
router.route('/new').post(protect, (req, res) => {
    const id = req.user.data._id
    req.body.author = `${req.user.data.firstName} ${req.user.data.lastName}`
    let post = new Post(req.body)
    post.save();
    User.findByIdAndUpdate(id, {$push: {"posts": post._id}})
    .then((data) => {return res.json(data)})
    .catch(err => {return res.json(err)})
})
//READ
router.route('/:postId').get((req, res) => {
    Post.findById(req.params.postId)
    .then( data=> {
        return res.json(data)
    })
    
})
//UPDATE
router.route('/:postId/edit').get((req, res) => {
    Post.findById(req.params.postId)
    .then(( data) => {return res.json(data)})
})

router.route('/:postId/update').patch((req, res) => {
    Post.findByIdAndUpdate(req.params.postId, {$set: req.body})
    .then((err, data) => {
        if(err){console.log(err)}
        else{return res.json(data)}
    })
})
//DELETE

router.route('/:postId/delete').delete(protect, (req, res) => {
    let id = req.user.data._id;
    User.findByIdAndUpdate(
        id,{
            $pull: {
                'posts': `${req.params.postId}`
            }
        }
    )
    Post.findByIdAndRemove(req.params.postId)
    .then((err) => {
        if(err){console.log(err)}
        return res.json({msg: "Post deleted!"})
    })
})

//CREATE COMMENT
router.route('/:postId/comment/new').post((req, res) => {
    Comment.create(req.body).
    then((data) => {
        return res.json(data);
    })
})
//READ COMMENTS
router.route('/:postId/comment').get((req, res) => {
    Comment.find({postId: req.params.postId}).then((data) => {
        return res.json(data);
        
    })  
})
//UPDATE COMMENT
router.route('/:postId/comment/:commentId').get((req, res) => {
    Comment.findById(req.params.commentId).then(( data) => {
        return res.json(data)
    })
})
router.route('/:postId/comment/:commentId/update').patch((req, res) => {
    console.log(req.body)
    Comment.findByIdAndUpdate(req.params.commentId, {$set: req.body}).then((err, data) => {
        return res.json(data)
    })
})
//DELETE COMMENT
router.route('/:postId/comment/:commentId/delete').delete((req, res) => {
    Comment.findByIdAndDelete(req.params.commentId).then((err, data) => {
        return res.json({msg: 'Comment deleted!'})
    })
})
export default router;