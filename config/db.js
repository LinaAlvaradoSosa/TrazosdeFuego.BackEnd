import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI; // 👈 cambiamos el nombre

    if (!uri) {
      console.error("❌ MONGO_URI no está definido");
      return;
    }

    await mongoose.connect(uri);
    console.log("✅ Conectado a la base de datos");
  } catch (error) {
    console.log(
      `no se pudo conectar a la base de datos error: ${error.message}`
    );
  }
}
