import User from '../models/user';
const jwt = require('jsonwebtoken');
import db from '../db'
const protect = (handler)=>{
    return async (req,res)=>{
        let token;
        await db();
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded =jwt.verify(token,process.env.JWT_SECRET);
        
            req.user = await User.findById(decoded.id).select('-password');

            return handler(req,res)
        }catch(err){
            res.status(401);
            res.send("not authorised")
        }
    }
    if(!token){
        res.status(401);
        throw new Error("not authorised,no token")
    }
    }
};
export default protect;