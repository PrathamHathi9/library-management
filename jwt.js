const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path : './.env'});
const JWT_SECRET =  process.env.JWT_SECRET || 'secret';

//token verifier middleware
const jwtAuthMiddleware = ( req, res, next) => {
    const auth =req.headers.authorization;
    if(!auth) return next();
    const token = req.headers.authorization.split(" ")[1];
    if(!token)
        {
            return res.status(401).json({error : "unauthorized"});
        }
    
    try{
        const decoded = jwt.verify( token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({error : "invalid token"});
    }
}

//this will create token 
const generateToken = (userData)=> {
    return jwt.sign({userData}, JWT_SECRET, {expiresIn : 60});
}

module.exports = {jwtAuthMiddleware, generateToken};