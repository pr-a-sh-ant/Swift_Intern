import { Router } from "express";
import postController from "../controller/post.controller.js";
import authController from "../controller/auth.controller.js";

const postRouter = Router();

postRouter.post("/", authController.protect, postController.createPost);

postRouter.get("/", postController.getAllPosts);

postRouter.get("/:id", postController.getPostById);

postRouter.patch("/:id", authController.protect, postController.updatePost);

postRouter.delete("/:id", authController.protect, postController.deletePost);

export default postRouter;
