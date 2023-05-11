import express from "express";
import bcrypt from "bcrypt";
import path from "path";
import jwt from "jsonwebtoken";
const router = express.Router();
import multer from "multer";
import User from "../../models/User.js";
import { protect } from "../../middleware/index.js";
const tokenList = [];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage, dest: "../../public/assets" });
//A function that generates a token
const tokenGen = (data) => {
  return jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};
//A function that generates a refresh token

const refreshTokenGen = (data) => {
  return jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "3h",
  });
};
//CREATE
router.route("/new").post(upload.single("dP"), async (req, res) => {
  console.log(req.file);
  // const dP = req.file.filename;
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error("User with this email already exists!");
  }
  //Hashing the inputted password by the user and replacing it with original one and then storing in database
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashedPassword;
  // req.body.dP = dP;
  const newUser = new User(req.body);
  newUser.save();
  const refToken = refreshTokenGen(newUser);
  const response = {
    user: newUser,
    token: tokenGen(newUser),
    refToken: refToken,
    msg: "Welcome to BlogStation!!",
  };
  tokenList[refToken] = response;
  try {
    return res.json(response);
  } catch (err) {
    return res.json(err);
  }
});
//READ
router.get("/:userId", protect, (req, res) => {
  if (req.user.data._id === req.params.userId) {
    User.findById(req.params.userId).then((data) => {
      return res.status(200).json(data);
    });
  }
});

//UPDATE
router.get("/:userId/edit", protect, (req, res) => {
  User.findById(req.params.userId).then((data) => {
    return res.json(data);
  });
});
router.route("/:userId/update").patch((req, res) => {
  //$set attribute is an update operator in mongodb. It sets the specified values(req.body) in the model whose id is
  // given as the first parameter in the findByIdAndUpdate method
  User.findByIdAndUpdate(req.params.userId, { $set: req.body }).then(
    (error, data) => {
      if (error) {
        console.log(error);
      }
      return res.status(200).json({ data: data, msg: "User details updated!" });
    }
  );
});

//DELETE
router.route("/:userId/delete").delete((req, res) => {
  User.findByIdAndRemove(req.params.userId).then((error, data) => {
    if (error) {
      console.log(error);
    }
    return res.status(200).json({ msg: "User deleted!" });
  });
});
export default router;
