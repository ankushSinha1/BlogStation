import express from 'express';
const router = express.Router();
import Post from '../../models/Post.js';

router.route('/').get((req, res) => {
    Post.find({})
    .then(data => {return res.json(data)})
    .catch(err => {return res.json(err)})
})
export default router;