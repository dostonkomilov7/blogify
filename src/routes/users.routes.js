import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { upload } from "../configs/multer.config.js";

const userRouter = Router();

userRouter
    .get("/users", Protected(true), usersController.getAllUsers)
    .get("/viewers", usersController.getAllUsers)
    .get("/users/:id", Protected(true), usersController.getSingleUser)
    .delete("/users/:id", Protected(true), usersController.deleteUser)
    .post("/users/upload-photo/:id", Protected(true),
        upload.fields([
            {name: "image", maxCount: 1},
        ]), usersController.upload)

export default userRouter;