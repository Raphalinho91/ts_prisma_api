import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
export const BASE_URL = process.env.URL_FRONTEND;
