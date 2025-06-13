import express from "express"
import { actualizar, borrarMensaje, guardarMensaje, login, mostrarMensajes, register } from "../controllers/admin.controller.js"


const router = express.Router()

// rutas para admin

router.post('/register', register)
router.post('/login', login)
router.put('/actualizar/:id', actualizar)


// rutas de mensaje de contacto

router.post('/nuevoMensaje', guardarMensaje)
router.get('/mostrarMensajes', mostrarMensajes)
router.delete('/borrarMensaje/:id', borrarMensaje)




export default router