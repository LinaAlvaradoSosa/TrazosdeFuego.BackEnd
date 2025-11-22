import express from "express";
import upload from '../middleware/multer.js';
import tokenverification from '../middleware/jwt.js';
import {
  borrarProducto,
  crearProducto,
  obteneProducto,
  obteneProductoNombre,
  obtenerImagenes,
  obtenerporTipo,
  obtenerProductos
} from "../controllers/productos.controller.js";

const router = express.Router();

router.post('/crear', tokenverification, upload.single('imagen'), crearProducto);
router.get('/', obtenerProductos);
router.delete('/borrarProducto/:id', tokenverification, borrarProducto);
router.get('/obtenerProductosPorTipo/:tipo', obtenerporTipo);
router.get('/obtenerImagenes', obtenerImagenes);
router.get('/obtenerProducto/:id', obteneProducto);
router.get('/obteneProductoNombre', obteneProductoNombre);
router.get('/obtenerProductoNombre/:name', obteneProductoNombre);

export default router;
