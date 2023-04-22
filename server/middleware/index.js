import jwt from "jsonwebtoken";

//In the req.headers.authorizatoin, the token is stored as - 'Bearer ${token}'. So we want to extract token from there
export const protect = async (req, res, next) => {
    let token;
    try{
        if(req.headers.authorization ){
            //Get token from header
            token = req.headers.authorization.split(' ')[1]
            //verify token
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
            //Get user from the token
            req.user = decoded
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