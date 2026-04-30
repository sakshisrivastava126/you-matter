import { Router } from "express";
import { protect } from "../middlewares/auth.js"
import { signup, login, logout, getSpecialists, getUsers } from "../controllers/user.controller.js"

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/check", protect);
userRouter.get("/specialists", getSpecialists);
userRouter.get("/users", protect, getUsers);   // DM: list of all users

export default userRouter;
