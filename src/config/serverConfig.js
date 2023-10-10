import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const Jwt_key = process.env.Jwt_key;
export const MONGO_URI = process.env.MONGO_URI;

