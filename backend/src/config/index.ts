import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    geminiApiKey: process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
};

if (!config.geminiApiKey) {
    console.warn('WARNING: GEMINI_API_KEY is not defined in the environment.');
}

if (!config.databaseUrl) {
    console.warn('WARNING: DATABASE_URL is not defined in the environment.');
}
