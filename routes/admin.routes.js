// routes/admin.routes.js
import express from "express";
import {
    register,
    login,
    actualizar,
    guardarMensaje,
    mostrarMensajes,
    borrarMensaje,
} from "../controllers/admin.controller.js";
import tokenverification from "../middleware/jwt.js";

const router = express.Router();

// 🔐 RUTAS DE AUTENTICACIÓN ADMIN

// Registrar admin (si solo tú lo usas, luego lo puedes desactivar)
router.post("/register", register);   // POST /api/register

// Login del admin
router.post("/login", login);         // POST /api/login


// 🔐 RUTAS PROTEGIDAS PARA ADMIN

// Actualizar datos del admin (nombre, correo, contraseña, etc.)
router.put("/actualizar/:id", tokenverification, actualizar);
// PUT /api/actualizar/:id


// 📩 RUTAS DE MENSAJES DE CONTACTO

// 1) Esta la usa el formulario público de la web
router.post("/nuevoMensaje", guardarMensaje);
// POST /api/nuevoMensaje (PÚBLICA)

// 2) Estas dos solo debería verlas el admin logueado
router.get("/mostrarMensajes", tokenverification, mostrarMensajes);
// GET /api/mostrarMensajes (PROTEGIDA)

router.delete("/borrarMensaje/:id", tokenverification, borrarMensaje);
// DELETE /api/borrarMensaje/:id (PROTEGIDA)


export default router;
