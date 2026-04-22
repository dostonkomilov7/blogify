import express from "express";
import path from "node:path";
import expHbs from "express-handlebars"
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { connectDB } from "./configs/database.config.js";
import { helpers } from "./helpers/hbs.helpers.js";
import APP_PORT from "./configs/app.config.js";
import apiRouter from "./routes/index.js";
import router from "./routes/home.js";
import authController from "./controllers/auth.controller.js";

const app = express();
config({quiet: true});

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(express.urlencoded({extended: true}));

// const hbs = expHbs.create({
//     extname: "hbs",
//     helpers: helpers,
//     defaultLayout: "main",
//     layoutsDir: path.join(process.cwd(), "src", "views", "layouts"),
//     partialsDir: path.join(process.cwd(), "src", "views", "partials"),
// });

// app.engine("hbs", hbs.engine);
// app.set("view engine", "hbs");
// app.set("views", path.join(process.cwd(), "src", "views"))
// app.use("/public", express.static(path.join(process.cwd(), "src", "public")))

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

connectDB()
    .then((res) => res)
    .catch((error) => console.log(error))

await authController.seedAdmins();

// app.use("/", router);
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