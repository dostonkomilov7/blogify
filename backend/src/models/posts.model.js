import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: mongoose.SchemaTypes.String,
            required: true,
            min: [4, "Title must be at least 4 characters"],
        },
        content: {
            type: mongoose.SchemaTypes.String,
            min: [10, "Title must be at least 10 characters"],
        },
        image_url: {
            type: mongoose.SchemaTypes.String,
        },
        video_url: {
            type: mongoose.SchemaTypes.String,
        },
        created_by: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        versionKey: false,
        collection: "posts",
        timestamps: true
    }
);

export const Post = mongoose.model("Post", PostSchema);