import express from "express";
const router = express.Router();
import Post from '../../models/Post.js';
import Comment from "../../models/Comment.js";
import { protect } from "../../middleware/index.js";
import cloudinary from 'cloudinary';
import mongoose from "mongoose";
cloudinary.config({
    cloud_name: 'dvstzyogy',
    api_key: '544918322574147',
    api_secret: 'WJv1374MZiWj1W-_zUMnxPAfir4',
});  
const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};
router.route('/uploadImage').post(async (req, res)  => {
    await cloudinary.v2.uploader.upload_large(req.body.myPict, opts)
    .then(result => {return res.json(result)})
    .catch(err => {return res.json(err)})
})

//CREATE
router.route('/new').post(protect, async (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    try{
        if(req.user && req.user.data.username === req.body.author.username){
            let post = new Post(req.body)
            post.save()
            .then((data) => {return res.json({data, msg: "New post added!"})})
            .catch(err => {return res.json({msg: err.toString()})})
        }else{
            return res.json(req.status);
        }
    }catch(err){
        return res.json({msg: err.toString()})
    }
})
//READ
router.route('/:postId').get((req, res) => {
    Post.findById(req.params.postId)
    .then( data=> {
        return res.json(data)
    }).catch(err => {
        return res.json({err: err.toString()})
    })
    
})
//UPDATE
router.route('/:postId/edit').get(protect, (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    Post.findById(req.params.postId)
    .then(( data) => {
        return res.json(data)
    }).catch(err => {
        return res.json({err: err.toString()})
    })
})

router.route('/:postId/update').patch((req, res) => {
    Post.findByIdAndUpdate(req.params.postId, {$set: req.body})
    .then( data => {
            return res.json({data, msg: 'Post updated!'})
        }
    )
    .catch(err => {return res.json({msg: err.toString()})})
})
//DELETE

router.route('/:postId/delete').delete(protect, (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    Post.findByIdAndRemove(req.params.postId)
    .then((data) => {   
        Comment.deleteMany({postId: req.params.postId})
        .then(data => console.log(data))
        .catch(err => console.log(err))
        return res.json({ msg: "Post deleted!"})
    }).catch(err => {
        return res.json({err: err.toString()})
    })
})

//CREATE COMMENT
router.route('/:postId/comment/new').post(protect, (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    Post.findByIdAndUpdate(req.params.postId, {comments: {$push: req.body}})
    Comment.create(req.body)
    .then((data) => {
        return res.json({data, msg: "Comment added!"});
    }).catch(err => {
        return res.json({err: err.toString()})
    })
})
//READ COMMENTS
router.route('/:postId/comment').get((req, res) => {
    Comment.find({postId: req.params.postId})
    .then((data) => {
        return res.json(data);
    }).catch(err =>{
        return res.json(err)
    })
})
//UPDATE COMMENT
router.route('/:postId/comment/:commentId').get(protect, (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    Comment.findById(req.params.commentId)
    .then(( data) => {
        return res.json(data)
    }).catch(err => {
        return res.json({err: err.toString()})
    })
})
router.route('/:postId/comment/:commentId/update').patch((req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, {$set: req.body})
    .then((data) => {
        return res.json({data, msg: 'Comment updated'})
    })
    .catch(err => {
        console.log(err)
        return res.json({msg: err.toString()})})
})
//DELETE COMMENT
router.route('/:postId/comment/:commentId/delete').delete(protect, ( req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    Comment.findByIdAndDelete(req.params.commentId).then((data) => {
        return res.json({data, msg: 'Comment deleted'})
    })
    .catch(err => {return res.json({err: err.toString()})})
})
export default router;