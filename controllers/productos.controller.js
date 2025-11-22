// controllers/productos.controller.js
import Productos from '../models/productos.model.js';
import fs from 'fs';
import path from 'path';

export const crearProducto = async (req, res) => {
  try {
    const { nombre, tipo } = req.body;

    if (!nombre || !tipo) {
      return res.status(400).json({ error: 'Nombre y tipo son obligatorios' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Imagen requerida' });
    }

    // guardamos path relativo "productos/archivo.png"
    const relativePath = path.join('productos', req.file.filename);

    const nuevoProducto = new Productos({
      nombre,
      tipo,
      imagen: relativePath,
    });

    await nuevoProducto.save();

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('❌ Error al crear producto (back):', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

    // GET /api/productos?pagina=1&limite=12
export async function obtenerProductos(req, res) {
    try {
        let { pagina = 1, limite = 12 } = req.query;
        pagina = parseInt(pagina);
        limite = parseInt(limite);

        const skip = (pagina - 1) * limite;

        const [productos, total] = await Promise.all([
        Productos.find().skip(skip).limit(limite),
        Productos.countDocuments()
        ]);

        const data = productos.map(p => ({
        ...p.toObject(),
        imagenUrl: `${req.protocol}://${req.get('host')}/uploads/${p.imagen}`
        }));

        res.json({
        ok: true,
        data,
        total,
        pagina,
        totalPaginas: Math.ceil(total / limite),
        });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
    }

    // GET /api/productos/obtenerProducto/:id
export async function obteneProducto (req, res) {
    try {
        const { id } = req.params;
        const product = await Productos.findById({ _id: id });
        if (!product) return res.status(404).send('The product does not exist');

        res.status(200).json({
        ok: true,
        product: {
            ...product.toObject(),
            imagenUrl: `${req.protocol}://${req.get('host')}/uploads/${product.imagen}`
        }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
    }

    // DELETE /api/productos/borrarProducto/:id
    export async function borrarProducto(req, res) {
        try {
          const { id } = req.params;
      
          const producto = await Productos.findById(id);
          if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
          }
      
          // Borrar imagen del disco
          if (producto.imagen) {
            const filePath = path.join('uploads', producto.imagen); // 'uploads/productos/archivo.png'
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('⚠️ Error al eliminar imagen del disco:', err.message);
              } else {
                console.log('🗑️ Imagen eliminada del disco:', filePath);
              }
            });
          }
      
          // Borrar documento en Mongo
          await Productos.findByIdAndDelete(id);
      
          res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
        } catch (error) {
          console.error('❌ Error al eliminar producto:', error);
          res.status(500).json({ error: 'Error al eliminar producto' });
        }
      }

    // GET /api/productos/obtenerProductosPorTipo/:tipo?pagina=1&limite=12
export async function obtenerporTipo (req, res) {
    try {
        const { tipo } = req.params; 

        const validarTipo = [
        'accesorios',
        'artilleria',
        'aviacion',
        'caballeria',
        'comunicaciones',
        'esculturas-militares',
        'espro',
        'infanteria',
        'ingenieros',
        'inteligencia',
        'logistica'
        ];

        if (!validarTipo.includes(tipo)) {
        return res.status(400).json({ message: "Tipo de producto no válido" });
        }

        let { pagina = 1, limite = 12 } = req.query;
        pagina = parseInt(pagina);
        limite = parseInt(limite);

        const skip = (pagina - 1) * limite;

        const [productos, total] = await Promise.all([
        Productos.find({ tipo }).skip(skip).limit(limite),
        Productos.countDocuments({ tipo })
        ]);

        const data = productos.map(p => ({
        ...p.toObject(),
        imagenUrl: `${req.protocol}://${req.get('host')}/uploads/${p.imagen}`
        }));

        res.json({
        ok: true,
        data,
        tipo,
        total,
        pagina,
        totalPaginas: Math.ceil(total / limite),
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message }); 
    }
    }

    // GET /api/productos/obtenerImagenes
export async function obtenerImagenes(req, res) {
    try {
        const productos = await Productos.find({}, 'imagen');
        const imagenes = productos.map(p => ({
        path: p.imagen,
        url: `${req.protocol}://${req.get('host')}/uploads/${p.imagen}`
        }));
        res.status(200).json({ imagenes });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message }); 
    }
    }

    // GET /api/productos/obteneProductoNombre?nombre=algo
export const obteneProductoNombre = async (req, res) => {
    try {
        const buscar = req.params.nombre || req.query.nombre;

        if (buscar) {
        const data = await Productos.find({
            nombre: { $regex: buscar, $options: 'i' }
        });
        const mapeados = data.map(p => ({
            ...p.toObject(),
            imagenUrl: `${req.protocol}://${req.get('host')}/uploads/${p.imagen}`
        }));
        res.status(200).json(mapeados);
        } else {
        const dataProducts = await Productos.find();
        const mapeados = dataProducts.map(p => ({
            ...p.toObject(),
            imagenUrl: `${req.protocol}://${req.get('host')}/uploads/${p.imagen}`
        }));
        res.status(200).json(mapeados);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message }); 
    }
};
