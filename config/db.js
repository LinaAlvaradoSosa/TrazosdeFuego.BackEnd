import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export async function connectDB() {
    try {
        await mongoose.connect(process.env.LINKDB)
        console.log('conectado a la base de datos');
        
    } catch (error) {
        console.log(`no se pudo conectar a la base de datos error: ${error.message}`);
    }
}