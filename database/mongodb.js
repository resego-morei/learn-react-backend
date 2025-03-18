import mongoose from "mongoose";
import {DBURL, NODE_ENV} from "../config/env.js";
import process from 'process';

if(!DBURL) {
    throw new Error('Please define the MONGODB_URL environment variable inside .env.<development/production>.local file'); 
}

const connectDB = async () => {
    try {
        await mongoose.connect(DBURL);
        console.log(`MongoDB connected: ${NODE_ENV}`);
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;