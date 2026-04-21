import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
    {
        post_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "Post"
        },
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "User"
        },
    },
    {
        versionKey: false,
        collection: "likes",
        timestamps: true
    }
)

export const Like = mongoose.model("Like", LikeSchema);