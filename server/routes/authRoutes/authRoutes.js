import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
const tokenList = [];

//A function that generates a access token
const tokenGen = (data) => {
    return jwt.sign({data},process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}
//A function that generates a refresh token
const refreshTokenGen = (data) => {
    return jwt.sign({data}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2m'})
}

//LOGIN ROUTE

router.route('/login').post(async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {return res.status(400).json({ msg: "User does not exist. "})};
    try{
        //match will be a boolean value based on the comparison of req.body.password and user.password
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match){return res.status(400).json({msg: "Invalid credentials"})}
        else{
            const accessToken = tokenGen(user);
            const refToken = refreshTokenGen(user)
            // delete user.password;
            const response = {
                user: user,
                token: accessToken,
                refToken: refToken,
                msg: `Welcome back, ${user.firstName} ${user.lastName} ! `
            }
            tokenList[refToken] = response
            try{
                return res.json(response)

            }catch(err){
                return res.json(err)
            }
        }
    }catch(err){
        return res.json({err: err})
    }
});
export default router;