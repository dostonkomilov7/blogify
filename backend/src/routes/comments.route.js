import { Router } from "express";
import commentsController from "../controllers/comments.controller.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { createCommentSchema } from "../schemas/comments/create-comment.schema.js";

const commentRouter = Router();

commentRouter
    .get("/", commentsController.getAllComment)
    .post("/", validationMiddleware(createCommentSchema), commentsController.createComment)
    .delete("/:id", commentsController.deleteComment)

export default commentRouter;