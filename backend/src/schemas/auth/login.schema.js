import Joi from "joi";

export const LoginSchema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().alphanum().min(6).required(),
}).required();