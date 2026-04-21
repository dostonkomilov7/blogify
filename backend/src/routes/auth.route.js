import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { LoginSchema } from "../schemas/auth/login.schema.js";
import authController from "../controllers/auth.controller.js";
import { RegisterSchema } from "../schemas/auth/register.schema.js";
import { VerifySignatureMiddleware } from "../middlewares/verify-signature.middleware.js";

const authRouter = Router();

authRouter
    .post("/login", validationMiddleware(LoginSchema), authController.login)
    .post("/register", validationMiddleware(RegisterSchema), authController.register)
    .post("/refresh", authController.refresh)
    .post("/forgot-password", authController.forgotPassword)
    .post("/reset-password", VerifySignatureMiddleware, authController.resetPassword)

export default authRouter;