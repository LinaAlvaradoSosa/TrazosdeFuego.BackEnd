import express from "express"
import upload from '../middleware/multer.js';
import { borrarProducto, crearProducto, obteneProducto, obteneProductoNombre, obtenerImagenes, obtenerporTipo, obtenerProductos } from "../controllers/productos.controller.js"

const router = express.Router();

// link:http://localhost:4000/api/productos/crear
router.post('/crear', upload.single('imagen'), crearProducto);   
// link-obtener-productos:http://localhost:4000/api/productos 
router.get('/', obtenerProductos);

//localhost:4000/api/productos/borrarProducto/68234dfd7d5a2a6b0395a7e4
router.delete('/borrarProducto/:id', borrarProducto)
//localhost:4000/api/productos/obtenerProductosPorTipo/extra
router.get('/obtenerProductosPorTipo/:tipo', obtenerporTipo)


router.get('/obtenerImagenes', obtenerImagenes)
router.get('/obtenerProducto/:id', obteneProducto)
router.get('/obteneProductoNombre', obteneProductoNombre); 


router.get('/obtenerProductoNombre/:name', obteneProductoNombre); 




export default router;