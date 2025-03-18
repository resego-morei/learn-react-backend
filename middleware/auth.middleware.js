import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.models.js';


export const authorize = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            const error = new Error('Not authorized to access this route');
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if(!user){
            const error = new Error('No user found with this id');
            error.statusCode = 404;
            throw error;
        }

        req.user = user;
        next();

    }catch(err){
        res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};