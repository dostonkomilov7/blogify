import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { createLikeSchema } from "../schemas/likes/create-like.schema.js";
import likesController from "../controllers/likes.controller.js";

const likesRouter = Router();

likesRouter
    .post("/:id/like", validationMiddleware(createLikeSchema), likesController.createLike)
    .delete("/:id/like", likesController.deleteLike)

export default likesRouter;