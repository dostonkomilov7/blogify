import Joi from "joi";

export const RegisterSchema = Joi.object({
    name: Joi.string().min(3).required(),
    age: Joi.number().integer().min(5).required(),
    email: Joi.string().min(15).required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().alphanum().min(8).required()
}).required();