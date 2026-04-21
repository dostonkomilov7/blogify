import Joi from "joi";

export const RegisterSchema = Joi.object({
    name: Joi.string().min(4).required(),
    age: Joi.number().integer().min(16).required(),
    email: Joi.string().min(15).required(),
    username: Joi.string().min(5).required(),
    password: Joi.string().alphanum().min(6).required()
}).required();