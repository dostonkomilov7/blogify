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

export const createLikeSchema = Joi.object({
    post_id: Joi.string().custom(validateObjectId).required(),
    user_id: Joi.string().custom(validateObjectId).required()
}).required();