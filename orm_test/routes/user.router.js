import express from "express";
import UserController from "../controllers/user.controller.js";

const userRouter = express.Router();

const userController = new UserController();

// get all users
userRouter.get("/", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

export default userRouter;
