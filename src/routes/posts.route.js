import { Router } from "express";
import postsController from "../controllers/posts.controller.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { createPostSchema } from "../schemas/posts/create-post.schema.js";
import { updatePostSchema } from "../schemas/posts/update-post.schema.js";
import { upload } from "../configs/multer.config.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Role } from "../middlewares/roles.middleware.js";

const postRouter = Router();

postRouter
    .get("/posts", Protected(true), postsController.getAllPosts)
    .get("/posts/:id", Protected(true), postsController.getSinglePost)
    .post("/posts", Protected(true), Role("USER", "ADMIN"), upload.fields([
        {name: "image", maxCount: 1},
        {name: "video", maxCount: 1},
        ]),
        postsController.createPost
    )
    .patch("/posts/:id", Protected(true), Role("USER", "ADMIN"), upload.fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]), postsController.updatePost)
    .delete("/posts/:id", postsController.deletePost)

export default postRouter;