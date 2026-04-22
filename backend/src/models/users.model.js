import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: mongoose.SchemaTypes.String,
            required: true,
            min: [3, "Ism kamida 3ta belgidan iborat bo'lishi kerak"],
        },
        age: {
            type: mongoose.SchemaTypes.Int32,
            min: [16, "Kamida 16 yosh bo'lishi kerak"],
        },
        email: {
            type: mongoose.SchemaTypes.String,
            required: true,
            unique: true,
        },
        password: {
            type: mongoose.SchemaTypes.String,
            required: true,
            unique: true,
        },
        role: {
            type: mongoose.SchemaTypes.String,
        },
        profile_image: {
            type: mongoose.SchemaTypes.String,
            default: null,
        },
        device: {
            type: mongoose.SchemaTypes.String,
            required: true,
        }
    },
    {
        versionKey: false,
        collection: "users",
        timestamps: true
    }
);

export const User = mongoose.model("User", UserSchema);