import Joi from "joi";

export const updatePostSchema = Joi.object({
    title: Joi.string().min(4).required(),
    content: Joi.string().min(10).required(),
}).required();