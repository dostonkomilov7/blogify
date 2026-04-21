import Joi from "joi";
import { isObjectIdOrHexString } from "mongoose";

const validateObjectId = (value, helpers) => {
    if (!isObjectIdOrHexString(value)) {
        return helpers.message({
            custom: "Field must be valid ObjectId"
        });
    }
    return value
}

export const createPostSchema = Joi.object({
    title: Joi.string().min(4).required(),
    content: Joi.string().min(10).required(),
    created_by: Joi.string().custom(validateObjectId).required()
}).required();