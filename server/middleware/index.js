import jwt from "jsonwebtoken";
import axios from "axios";
//In the req.headers.authorizatoin, the token is stored as - 'Bearer ${token}'. So we want to extract token from there
export const protect = async (req, res, next) => {
    let token;
    
    try{
        if(req.headers.authorization ){
            //Get token from header
            token = req.headers.authorization.split(' ')[1]
            //verify token
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if(err){
                    return console.log(err)
                }
                req.user = decoded  
                // console.log(new Date(decoded.exp))      
                
            })
            next();
        }
    }catch(err){
        console.log(err)
        return res.status(401).json({msg: 'Not authorized!'})
    }
    if(!token){
        return res.status(401).json({msg: 'Not authorized, no token!'})
    }
}