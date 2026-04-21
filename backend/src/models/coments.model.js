import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        text: {
            type: mongoose.SchemaTypes.String,
            required: true,
            min: [2, "Text must be at least 2 characters"],
        },
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
        collection: "comments",
        timestamps: true
    }
);

export const Comment = mongoose.model("Comment", CommentSchema);