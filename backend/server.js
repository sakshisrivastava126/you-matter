import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./src/routes/userRoute.js";
import MessageRouter from "./src/routes/messageRoute.js";
import { Server, Socket } from "socket.io";

const app = express();
dotenv.config();
//socket.io
const server = createServer(app);
const io = new Server(server);

//middleware
app.use(cors());
//http req se jo raw json string receive hoti h in the body usse ek readable format me convert krat hai for a programming lang to read
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(() => console.log('Mongodb Connected'))
.catch((err) => console.log(err));

app.use("/auth", userRouter);
app.use("/message", MessageRouter);

//socket is a client, has info of client
io.on('connection', (socket)=>{
    console.log('a user connected');
    socket.on('user-message', (message)=>{
        console.log(message);
    });
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, ()=>{
    console.log(`Server is runnnnin at ${PORT}`);
});


