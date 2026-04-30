import dotenv from "dotenv";
import express from "express";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./src/routes/userRoute.js";
import MessageRouter from "./src/routes/messageRoute.js";
import { Server } from "socket.io";
import http from "http";
import chatRouter from "./src/routes/chatBotRoute.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

// Allow requests from the Next.js dev server
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
}));
//http req se jo raw json string receive hoti h in the body usse ek readable format me convert krat hai for a programming lang to read
app.use(express.json());

console.log(process.env.GEMINI_API_KEY);

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(() => console.log('Mongodb Connected'))
.catch((err) => console.log(err));

app.use("/auth", userRouter);
app.use("/message", MessageRouter);
app.use("/bot", chatRouter);

//socket is a client, has info of client
io.on('connection', (socket)=>{
    console.log('a user connected');

    //personal message to specialist
    socket.on('personal-message', ({receiverId, message})=>{
        io.to(receiverId).emit('personal-message', message);
    });

    socket.on('join-community', (community) =>{
        socket.join(community);
        socket.to(community).emit('user-connected', socket.id)
    });

    socket.on('leave-community', (community)=>{
        socket.leave(community)
    });

    socket.on('community-message', (message)=>{
        io.to(message.community).emit('community-message', message);
    });
});


//ai integration
//GEMINI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// app.post('/generate', async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     const result = await model.generateContent("try to give real answers");
//     const response = await result.response;
//     const text = response.text();
    
//     res.json({ response: text });
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     res.status(500).json({ error: "Failed to generate response" });
//   }
// });

// const ai = new OpenAI({
//     apiKey : process.env.OPENAI_API_KEY,
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// });

// const SYSTEM_PROMPT = `You are an AI agent who solves user queries and gives answer in 50 words. 
// You don't answer related to any coding questions and ploitely say user to ask different questions.`;

// app.get('/', (req, res)=>{
//     res.send("tea")
// });

// app.post('/chat', async (req, res)=>{
//     const {messages} = req.body;

//     try{
//         const response = await ai.models.generateContent({
//             model : 'gemini-2.5-flash',
//             messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
//         });
//         res.json({
//             message: response.choices[0].message,
//         });
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Failed to get response from OpenAI'});
//     }
// });

const PORT = process.env.PORT || 4444;
server.listen(PORT, ()=>{ 
    console.log(`Server is runnnnin at ${PORT}`);
});


