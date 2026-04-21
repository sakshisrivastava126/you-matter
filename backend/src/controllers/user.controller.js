import bcrypt, { genSalt } from "bcryptjs"
import User from "../models/user.js";

export const signup = async (req, res) =>{
    const{userName, email, password, age, role} = req.body;
    try{
        if(!userName || !email || !password || !age || !role){
            return res.json({success : false, message: "Missing details"})
        }
        const user = await User.findOne(email);

        if(user){
            return res.json({success: false, message: "user already exist"})
        }

        const salt = await genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({userName, email, hashedPassword, age, role});

        const token = generateToken(newUser._id);
        newUser.password = undefined;
        res.json({success: true, userData: newUser, token, message: "Signup completed"}) 
    }
    catch(err){
        console.log(err);
        res.json({succes: false, message: err.message});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.json({success: false, message: "Missing details"})
        }

        const user = await User.findOne(email);
        if(!user){
            return res.json({succes: false, message: "user does not exist"})
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            res.json({succes: false, message: "Incorrect password"});
        }
        const token = generateToken(user._id);
        user.password = undefined;
        res.json({succes: true, user, token, message: "logged in"}); 
    }
    catch(err){
        console.log(err);
        res.json({succes: false, message: err.message});
    }
}

export const logout = async (req, res) => {
    try{
        res.cookie('jwt', '', {maxAge: 0, httpOnly: true});
        res.json({success: true, message: "logout successful"});
    }
    catch(err){
        console.log(err.message);
        res.json({success: false, message: err.message});
    }
}

