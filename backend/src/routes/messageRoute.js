import { Router } from "express";
import { sendMessage, getMessage } from "../controllers/message.controller.js";
import { signup, login, logout} from "../controllers/user.controller.js"

const messageRouter = Router();

messageRouter.post('/sendMessage', sendMessage);
messageRouter.get('/getMessage', getMessage);

export default messageRouter;