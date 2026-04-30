import { Router } from "express";
import { chatBot } from "../controllers/chat-bot-controller.js";

const chatRouter = Router();

chatRouter.post('/chat', chatBot);

export default chatRouter;