import { Router } from "express";
import { protect } from "../middlewares/auth.js"
import { signup, login, logout} from "../controllers/user.controller.js"

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/check", protect);

export default userRouter;
