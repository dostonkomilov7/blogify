import express from "express";
import path from "node:path";
import { connectDB } from "./configs/database.config.js";
import apiRouter from "./routes/index.js";
import APP_PORT from "./configs/app.config.js";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import authController from "./controllers/auth.controller.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

const app = express();
config({quie: true});

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_KEY))
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

const server = app.listen(APP_PORT, () => {
    console.log("Listening on ", APP_PORT);
});

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled rejection error reason: ", reason, " Promise: ", promise);

    server.close(() => {
        process.exit(1);
    });
});