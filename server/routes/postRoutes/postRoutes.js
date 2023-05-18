import express from "express";
const router = express.Router();
import Post from '../../models/Post.js';
import User from '../../models/User.js';
import Comment from "../../models/Comment.js";
import { protect } from "../../middleware/index.js";
import cloudinary from 'cloudinary';

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
    console.log(req.user)
    req.body.author = `${req.user.data.firstName} ${req.user.data.lastName}`
    let post = new Post(req.body)
    post.save()
    .then((data) => {return res.json({data, msg: "New post added!"})})
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
    var name = `${req.user.data.firstName} ${req.user.data.lastName}`
    if(name === `${req.user.data.firstName} ${req.user.data.lastName}`)
    Post.findByIdAndRemove(req.params.postId)
    .then((data) => {   
        return res.json({msg: "Post deleted!"})
    }).catch(err => console.log(err))
})

//CREATE COMMENT
router.route('/:postId/comment/new').post(protect, (req, res) => {
    Comment.create(req.body)
    .then((data) => {
        return res.json({data, msg: "Comment added!"});
    })
})
//READ COMMENTS
router.route('/:postId/comment').get((req, res) => {
    Comment.find({postId: req.params.postId})
    .then((data) => {
        return res.json(data);
    })
    .catch(err =>{return res.json(err)})
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