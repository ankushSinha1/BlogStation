import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import RefToken from '../../models/refToken.js';

//A function that generates a access token
const tokenGen = (data) => {
    return jwt.sign({data},process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'})
}
//A function that generates a refresh token
const refreshTokenGen = (data) => {
    return jwt.sign({data}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'})
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
            let newRefToken = new RefToken({refToken: refToken})
            newRefToken.save();
            try{
                return res.json(response)

            }catch(err){
                return res.json(err)
            }
        }
    }catch(err){
        console.log(err)
        return res.json({msg: err.toString()})
    }
});

//Storing refToken in Database
router.route('/refToken').post(async (req, res) => {
    // console.log(JSON.parse(req.body))
    let dataInside = await RefToken.findOne({refToken: req.body.refToken})
    if(dataInside){
        jwt.verify(dataInside.refToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err){
                if(err.toString()==='TokenExpiredError: jwt expired'){
                    return res.json({msg: 'RefToken expired'})
                }
                return res.json({msg: err.toString()})
            }else{
                const response = {
                    user: req.body.user,
                    token: tokenGen(req.body.user),
                    refToken: dataInside.refToken,
                }
                try{
                    return res.json(response)
                }catch(err){
                    return res.json({msg: err.toString()})
                }
            }
        })
    }else{
        return res.json({msg: 'Refresh token not found!'})
    }
})
router.route('/deleteRefToken').post(async (req, res) => {
    let foundToken = await RefToken.findOne({refToken: req.body.refToken})
    if(foundToken){
        RefToken.deleteOne({refToken: foundToken.refToken})
        .then(data => {return res.json({msg: 'Token removed from database'})})
        .catch(err => console.log(err))
    }
})
export default router;