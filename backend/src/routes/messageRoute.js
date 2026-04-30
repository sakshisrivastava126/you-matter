import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { getDmMessages, sendDmMessage } from "../controllers/message.controller.js";

const messageRouter = Router();

// Direct message routes — all protected
messageRouter.get('/dm/:receiverId',  protect, getDmMessages);
messageRouter.post('/dm/:receiverId', protect, sendDmMessage);

export default messageRouter;