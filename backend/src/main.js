import express from "express";
import path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { connectDB } from "./configs/database.config.js";
import APP_PORT from "./configs/app.config.js";
import apiRouter from "./routes/index.js";
import authController from "./controllers/auth.controller.js";

const app = express();
config({ quiet: true });

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));



app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

connectDB()
    .then((res) => res)
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
});