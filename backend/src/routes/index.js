import { Router } from "express";
import userRouter from "./users.routes.js";
import postRouter from "./posts.route.js";
import commentRouter from "./comments.route.js";
import likesRouter from "./likes.route.js";
import authRouter from "./auth.route.js";

const apiRouter = Router();

apiRouter
    .use("/auth", authRouter)
    .use("/users", userRouter)
    .use("/posts", postRouter)
    .use("/comments", commentRouter)
    .use("/posts", likesRouter)

export default apiRouter;