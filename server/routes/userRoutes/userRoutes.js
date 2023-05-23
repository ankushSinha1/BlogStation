import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
import User from "../../models/User.js";
import RefToken from "../../models/refToken.js";
import { protect } from "../../middleware/index.js";
import cloudinary from 'cloudinary';
import Post from "../../models/Post.js";
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
const tokenGen = (data) => {
  return jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "24h",});
};
const refreshTokenGen = (data) => {
  return jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
};
//CREATE
router.route("/new").post(async (req, res) => {

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({msg: "User with this email already exists!"})
  }
  //Hashing the inputted password by the user and replacing it with original one and then storing in database
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashedPassword;
  const newUser = new User(req.body);
  newUser.save();
  const refToken = refreshTokenGen(newUser);
  const response = {
    user: newUser,
    token: tokenGen(newUser),
    refToken: refToken,
    msg: "Welcome to BlogStation!!",
  };
  let newRefToken = new RefToken({refToken: refToken})
  newRefToken.save();
  try {
    return res.json(response);
  } catch (err) {
    return res.json(err.toString());
  }
});
//READ
router.route('/:userId').get((req, res) => {
  User.findById(req.params.userId)
  .then((data) => {
    return res.json(data);
  })
  .catch(err => {
    return res.json({err: err.toString()})
  })
});

//UPDATE
router.route("/:userId/edit").get(protect, (req, res) => {
  if(req.status && req.status.msg === 'Token expired!'){
    return res.json(req.status)
  }
  User.findById(req.params.userId)
  .then((data) => {
    return res.json(data);
  })
  .catch(err => {return res.json({err: err.toString()})})
});
router.route("/:userId/update").patch((req, res) => {
  // Post.findOneAndUpdate({'author._id': req.params.userId}, {$set: {'author': req.body}})
  // .then(data => console.log('Updated'))
  // .catch(err => console.log(err))
  User.findByIdAndUpdate(req.params.userId, { $set: req.body })
  .then(data => { 
    return res.json({data, msg: "User details updated!" });
  })
  .catch(err => {return res.json({msg: err.toString()})})
})
//DELETE
router.route("/:userId/delete").delete(protect, (req, res) => {
  if(req.status && req.status.msg === 'Token expired!'){
    return res.json(req.status)
  }
  User.findByIdAndRemove(req.params.userId)
  .then((data) => {
    return res.json({data, msg: "User deleted!" });
  })
  .catch(err => {
    return res.json({err: err.toString()})
  })
});
export default router;
