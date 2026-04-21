import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { upload } from "../configs/multer.config.js";

const userRouter = Router();

userRouter
    .get("/", Protected(true), usersController.getAllUsers)
    .get("/viewers", usersController.getAllUsers)
    .get("/:id", Protected(true), usersController.getSingleUser)
    .delete("/:id", Protected(true), usersController.deleteUser)
    .post("/upload-photo/:id", Protected(true),
        upload.fields([
            {name: "image", maxCount: 1},
        ]), usersController.upload)

export default userRouter;