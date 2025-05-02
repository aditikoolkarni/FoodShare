const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const { connectDB } = require('./config/mongodb');
const { user_router } = require('./routes/user.routes');
const { post_router } = require('./routes/post.routes');
const { expirePostsJob } = require('./utils/cronJob');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: ["http://localhost:1616"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/user", user_router)
app.use("/post", post_router)

expirePostsJob()

app.listen(PORT, async ()=>{
    try{
        await connectDB();
        console.log("MongoDB connected successfully");
    }catch(err){
        console.error("MongoDB connection failed:", err.message);
        
    }
    console.log(`Server is running on port ${PORT}`);
})