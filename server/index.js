import express from "express"

import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"
import { Server } from "socket.io"

import Auth from './src/routes/Auth.js'
import User from './src/routes/User.js'
import Post from './src/routes/Post.js'

import Notification from "./src/routes/Notification.js"
import { createServer } from "http";

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

dotenv.config()


io.on("connection", (socket) => {
    socket.on('send-notification', (notificationData) => {
        console.log({ notificationData })
        io.emit("get-notification", notificationData)
    });
        
})

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});


// middleware

app.use(express.json({ limit: "5mb" })); 

app.use(express.urlencoded({ extended: true })); 
app.use(cors())

app.use(cookieParser())
 // route
app.use('/auth', Auth)
app.use('/users', User)
app.use('/posts', Post)
app.use('/notifications', Notification)

app.use((err, req, res, next) => {
  console.log({err});
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
const PORT = process.env.PORT;

server.listen(5000, () => {
  connect();
  console.log(`Connected to backend port ${PORT}`);
});


export default io