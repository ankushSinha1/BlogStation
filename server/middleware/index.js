import jwt from "jsonwebtoken";
export const protect = async (req, res, next) => {
    let token;
    req.status = {}
    req.user = {}
    try{
        //In the req.headers.authorizatoin, the token is stored as - 'Bearer ${token}'. So we want to extract token from there
        if(req.headers.authorization ){
            //Get token from header
            token = req.headers.authorization.split(' ')[1]
            //verify token
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if(err){
                    req.user = {msg: err.toString()}
                    if(req.user.msg === 'TokenExpiredError: jwt expired'){
                        req.status = {msg: 'Token expired!'}
                    }else{
                        req.status = {msg: err.toString()}
                    }
                }else{
                    req.user = decoded
                }
                next();
            })
        }
    }catch(err){
        console.log(err.toString())
        // return res.status(401).json({msg: 'Not authorized!'})
    }
    if(!token){
        req.status = {msg: 'No user logged in!'}
        return res.json(req.status)
        // return res.status(401).json({msg: 'Not authorized, no token!'})
    }
}