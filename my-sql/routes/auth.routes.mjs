import { Router } from "express";
import authController from "../controller/auth.controller.mjs";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

export default authRouter;
