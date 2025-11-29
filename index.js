import express from "express";
import { connectDB } from "./config/db.js";
import admin from "./routes/admin.routes.js";
import productos from "./routes/productos.routes.js"
import cors from "cors"

const app = express();
app.use(cors());
connectDB();

app.use(express.json());
app.use('/api', admin);

app.use('/uploads', express.static('uploads')); // para ver imágenes en navegador
app.use('/api/productos', productos);

// 👇👇 CAMBIO IMPORTANTE AQUÍ
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servicio corriendo en el puerto ${PORT}`);
});
