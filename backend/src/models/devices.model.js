import mongoose from "mongoose";

const DevicesSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "User"
        },
        device_name: {
            type: mongoose.SchemaTypes.String,
            required: true
        },
        device_type: {
            type: mongoose.SchemaTypes.String,
            required: true
        },
        ip_address: {
            type: mongoose.SchemaTypes.String,
        },
        user_agent: {
            type: mongoose.SchemaTypes.String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true,
        collection: "devices"
    }
);

export const Device = mongoose.model("Device", DevicesSchema);