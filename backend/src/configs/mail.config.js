import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.APP_PASS,
  },
});

export default transporter;