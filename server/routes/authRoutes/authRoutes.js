import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
const tokenList = [];

//A function that generates a access token
const tokenGen = (data) => {
    return jwt.sign({data},process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
}
//A function that generates a refresh token
const refreshTokenGen = (data) => {
    return jwt.sign({data}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h'})
}

//LOGIN ROUTE

router.route('/login').post(async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {return res.json({ msg: "User does not exist. "})};
    try{
        //match will be a boolean value based on the comparison of req.body.password and user.password
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match){return res.json({msg: "Invalid credentials"})}
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
            // var isExpiredToken = false;
            // var dateNow = new Date();
            // if(decoded.exp < dateNow.getTime()/1000){
            //     isExpiredToken = true;
            // }
            //Get user from the token
            // if(isExpiredToken){
            //     axios.post('http://localhost:3001/token')
            // }
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

// router.route('/token').post(async (req, res) => {
//     var refToken = req.body.refToken;
//     if(refToken in tokenList){
//         const response = {
//             user: req.body.user,
//             token: tokenGen(req.body.user),
//             refToken: refreshTokenGen(req.body.user),
//             msg: `Welcome back, ${req.body.user.firstName} ${req.body.user.lastName} ! `
//         }
//         try{
//             return res.json(response)
//         }catch(err){
//             return res.json(err)
//         }
//     }
// })
export default router;