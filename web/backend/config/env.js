import { config } from "dotenv";

config({ path : ".env" })

export const { PORT, DB_URL,
JWT_SECRET,
JWT_EXPIRES_IN,
SERVER_URL,
    ARCJET_KEY,
    ARCJET_ENV,
    QSTASH_TOKEN, QSTASH_URL,
    EMAIL_PASSWORD,} = process.env;
