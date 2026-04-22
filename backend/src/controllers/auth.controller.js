import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UAParser } from "ua-parser-js";
import { User } from "../models/users.model.js";
import jwtConfig from "../configs/jwt.config.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { ConflictRequestException } from "../exceptions/conflict-request.exception.js";
import signature from "../configs/signed.js";
import { sendEmail } from "../helpers/mail.helper.js";
import { Device } from "../models/devices.model.js";

class AuthController {
    #_userModel;
    #_deviceModel;
    constructor() {
        this.#_userModel = User
        this.#_deviceModel = Device
    };

    login = async (req, res) => {
        const { email, password } = req.body;

        const existingUser = await this.#_userModel.findOne({ email });

        if (!existingUser) {
            throw new NotFoundException("User is not found")
        }

        const isPassSame = await this.#comparePassword(password, existingUser.password);

        if (!isPassSame) {
            throw new ConflictRequestException("Given password invalid");
        }

        const ua = new UAParser(req.headers["user-agent"]);
        const device = ua.getResult();

        const foundedUserId = await this.#_deviceModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userData"
                }
            }
        ])

        const solidId = foundedUserId[0].user_id.toString().split("'")[0];

        await this.#_deviceModel.updateOne(
            { user_id: solidId },
            {
                device_name: device.device.model || device.device.vendor,
                device_type: device.device.type || "desktop",
                user_agent: req.headers["user-agent"],
            }
        );

        const accessToken = this.#generateToken({ id: existingUser.id, role: existingUser.role, device: device.device.model });
        const refreshToken = this.#generateRefreshToken({ id: existingUser.id, role: existingUser.role, device: device.device.model });

        res.cookie("accessToken", accessToken, {
            signed: true,
            expires: new Date(Date.now() + 5000),
        });

        res.cookie("refreshToken", refreshToken, {
            signed: true,
            expires: new Date(Date.now() + 10000)
        });

        res.send({
            success: true,
            accessToken,
            refreshToken
        });
    };

    register = async (req, res) => {
        const { name, age, username, email, password } = req.body;
        const existingUser = await this.#_userModel.findOne({ username: email });

        if (existingUser) {
            throw new BadRequestException("Username have already taken")
        }

        const hashedPass = await this.#hashPassword(password);

        const ua = new UAParser(req.headers["user-agent"]);
        const device = ua.getResult();

        const newUser = await this.#_userModel.insertOne({
            name,
            age,
            email,
            username,
            password: hashedPass,
            role: "USER",
            device: device.device.model
        });


        await this.#_deviceModel.insertOne({
            user_id: newUser.id,
            device_name: device.device.model || device.device.vendor,
            device_type: device.device.type || "desktop",
            user_agent: req.headers["user-agent"],
        });

        const accessToken = this.#generateToken({ id: newUser.id, role: newUser.role, device: device.device.model });
        const refreshToken = this.#generateToken({ id: newUser.id, role: newUser.role, device: device.device.model });

        res.send({
            success: true,
            accessToken,
            refreshToken
        });
    }

    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                throw new BadRequestException("Token not given");
            }

            const payload = jwt.verify(
                refreshToken,
                jwtConfig.REFRESH_KEY
            );

            const accessToken = this.#generateToken({ id: payload.id });

            res.send({
                success: true,
                data: {
                    accessToken
                }
            });
        } catch (error) {
            next(error)
        }
    }

    seedAdmins = async () => {
        const admins = [
            {
                name: "admin",
                username: "admin1",
                email: "admin777@example.com",
                password: "123456",
            }
        ];

        for (let a of admins) {
            const existingUser = await this.#_userModel.findOne({
                email: a.email,
            });

            if (!existingUser) {
                const ua = new UAParser(req.headers["user-agent"]);
                const device = ua.getResult();

                await this.#_userModel.insertOne({
                    ...a,
                    role: "ADMIN",
                    password: await this.#hashPassword(a.password),
                    device: device.device.model || device.device.vendor,
                });

                await this.#_deviceModel.insertOne({
                    user_id: newUser.id,
                    device_name: device.device.model || device.device.vendor,
                    device_type: device.device.type || "desktop",
                    user_agent: req.headers["user-agent"],
                });
            }
        }

        console.log("ADMIN SEEDED ✅")
    }

    forgotPassword = async (req, res, next) => {
        try {
            const BASE_URL = process.env.BASE_URL;
            const { email } = req.body;

            const foundedUser = await this.#_userModel.findOne({ email: email });

            if (!foundedUser) {
                throw new NotFoundException("User's is not found")
            }

            const signedUrl = signature.sign(
                `${BASE_URL}/auth/reset-password?userId=${foundedUser.id}`,
                { ttl: 300 },
            );

            sendEmail(email, "Signed URL", signedUrl);
            res.status(200).send({
                signedUrl
            })
        } catch (error) {
            next(error)
        }
    }

    resetPassword = async (req, res, next) => {
        try {
            const { userId } = req.query;
            const { password } = req.body;

            const hashedPass = await this.#hashPassword(password);

            await this.#_userModel.updateOne(
                { _id: userId },
                { password: hashedPass }
            );

            res.status(204).send();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    #hashPassword = async (pass) => {
        const hashedPassword = await bcrypt.hash(pass, 10);

        return hashedPassword
    };

    #comparePassword = async (originalPass, hashedPass) => {
        const isSame = await bcrypt.compare(originalPass, hashedPass);

        return isSame
    };

    #generateToken = (payload) => {
        const token = jwt.sign(
            payload,
            jwtConfig.SECRET_KEY,
            {
                algorithm: "HS256",
                expiresIn: jwtConfig.EXPIRE_TIME,
            },
        );

        return token
    };

    #generateRefreshToken = (payload) => {
        const token = jwt.sign(
            payload,
            jwtConfig.REFRESH_KEY,
            {
                algorithm: "HS256",
                expiresIn: jwtConfig.REFRESH_EXPIRE_TIME,
            },
        );

        return token
    }
}

export default new AuthController();