import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/users.model.js";
import jwtConfig from "../configs/jwt.config.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { ConflictRequestException } from "../exceptions/conflict-request.exception.js";
import signature from "../configs/signed.js";
import { sendEmail } from "../helpers/mail.helper.js";

class AuthController {
    #_userModel;
    constructor() {
        this.#_userModel = User
    };

    login = async (req, res) => {
        const {username, password} = req.body;

        const existingUser = await this.#_userModel.findOne({username});
 
        if(!existingUser){
            throw new NotFoundException("User is not found")
        }

        const isPassSame = await this.#comparePassword(password, existingUser.password);

        if(!isPassSame){
            throw new ConflictRequestException("Given password invalid");
        }

        const accessToken = this.#generateToken({id: existingUser.id, role: existingUser.role});
        const refreshToken = this.#generateRefreshToken({id: existingUser.id, role: existingUser.role});

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
        const {name, age, email, username, password} = req.body;
        const existingUser = await this.#_userModel.findOne({username: username});

        if(existingUser){
            throw new BadRequestException("Username have already taken")
        }

        const hashedPass = await this.#hashPassword(password);

        const newUser = await this.#_userModel.insertOne({
            name,
            age,
            email,
            username,
            password: hashedPass,
            role: "USER"
        });

        const accessToken = this.#generateToken({id: newUser.id, role: newUser.role});
        const refreshToken = this.#generateToken({id: newUser.id, role: newUser.role});

        res.send({
            success: true,
            accessToken,
            refreshToken
        });
    }

    refresh = async (req, res, next) => {
        try {
            const {refreshToken} = req.body;

            if(!refreshToken){
                throw new BadRequestException("Token not given");
            }

            const payload = jwt.verify(
                refreshToken,
                jwtConfig.REFRESH_KEY
            );

            const accessToken = this.#generateToken({id: payload.id});

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
                password: "123456",
            }
        ];

        for(let a of admins) {
            const existingUser = await this.#_userModel.findOne({
                username: a.username,
            });

            if(!existingUser){
                await this.#_userModel.insertOne({
                    ...a,
                    role: "ADMIN",
                    password: await this.#hashPassword(a.password)
                });
            }
        }

        console.log("ADMIN SEEDED ✅")
    }

    forgotPassword = async (req, res, next) => {
        try {
            const BASE_URL = process.env.BASE_URL;
            const {email} = req.body;

            const foundedUser = await this.#_userModel.findOne({email: email});

            if(!foundedUser){
                throw new NotFoundException("User's is not found")
            }

            const signedUrl = signature.sign(
                `${BASE_URL}/auth/reset-password?userId=${foundedUser.id}`,
                {ttl: 300},
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
            const {userId} = req.query;
            const {password} = req.body;

            const hashedPass = await this.#hashPassword(password);

            await this.#_userModel.updateOne(
                {_id: userId},
                {password: hashedPass}
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

    #generateToken =  (payload) => {
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

    #generateRefreshToken =  (payload) => {
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