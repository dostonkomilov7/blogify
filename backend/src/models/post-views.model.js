import mongoose from "mongoose";

const PostViewSchema = new mongoose.Schema(
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
        timestamps: true,
        collection: "post-views"
    }
);

export const PostView = mongoose.model("PostView", PostViewSchema);