// middleware/jwt.js
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

export default function tokenverification(req, res, next) {
  try {
    const KEY = process.env.SEGURITYKEY;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No se proporcionó token de autorización" });
    }

    // Esperamos formato: "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Formato de token inválido" });
    }

    const token = parts[1];

    jwt.verify(token, KEY, (error, decoded) => {
      if (error) {
        console.log("Error al verificar token:", error.message);
        return res.status(401).json({ error: "Token inválido o expirado" });
      }

      // Info del admin disponible en req.admin
      req.admin = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error, problema con el token" });
  }
}
