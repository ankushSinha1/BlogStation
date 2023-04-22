import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

//A function that generates a token
const tokenGen = (data) => {
    return jwt.sign({data},process.env.TOKEN_SECRET, {expiresIn: '1d'})
}
//Login route
router.route('/login').post(async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {return res.status(400).json({ msg: "User does not exist. "})};
    try{
        //match will be a boolean value based on the comparison of req.body.password and user.password
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match){return res.status(400).json({msg: "Invalid credentials"})}
        else{
            const accessToken = tokenGen(user);
            delete user.password;
            return res.status(200).json({accessToken: accessToken, user: user, msg: `Welcome back, ${user.firstName} ${user.lastName} ! `})
        }
    }catch(err){
        return res.json({err: err})
    }
});
export default router;