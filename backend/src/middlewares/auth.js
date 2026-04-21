import jwt from "jsonwebtoken"
import User from '../models/user.js'

export const protect = async (req, res, next) =>{
    try{
        const token = req.cookies.token;

        if(!token){
            res.json({
                success: false, message: "user not authorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if(!user) res.json({success: false, message: "user not found"});

        req.user = user;

        next();
    }
    catch(err){
        console.log(err.message);
        res.json({success: false, message: err.message})
    }
}