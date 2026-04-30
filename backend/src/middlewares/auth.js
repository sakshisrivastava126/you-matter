import jwt from "jsonwebtoken"
import User from '../models/user.js'

export const protect = async (req, res, next) => {
    try {
        // Accept token from cookie OR Authorization: Bearer <token> header
        let token = req.cookies?.token;
        const authHeader = req.headers['authorization'];
        if (!token && authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.json({ success: false, message: "user not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) return res.json({ success: false, message: "user not found" });

        req.user = user;
        next();
    }
    catch (err) {
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}