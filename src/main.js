import express from "express";
import path from "node:path";
import { connectDB } from "./configs/database.config.js";
import apiRouter from "./routes/index.js";
import APP_PORT from "./configs/app.config.js";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import authController from "./controllers/auth.controller.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

connectDB()
    .then((res) => console.log(res))
    .catch((error) => console.log(error))

await authController.seedAdmins();

app.use("/api", apiRouter);

app.all("*splat", (req, res) => {
    res.status(404).send({
        success: false,
        message: `Given URL : ${req.url} not found`,
    });
})

app.use(ErrorHandlerMiddleware)

app.listen(APP_PORT, () => {
    console.log("Listening on ", APP_PORT);
})