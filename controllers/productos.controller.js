import Productos from '../models/productos.model.js';
import cloudinary from '../utils/cloudinary.js'
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';


export const crearProducto = async (req, res) => {
    try {
        const { nombre, tipo } = req.body;
    
        if (!req.file) {
            return res.status(400).json({ error: 'Imagen requerida' });
        }
    
        const buffer = req.file.buffer;
    
        const resultado = await uploadToCloudinary(buffer, 'productos');
        const nuevoProducto = new Productos({
            nombre,
            tipo,
            imagen: resultado.secure_url,
        });
        await nuevoProducto.save();
    
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export async function obtenerProductos(req, res) {
    try {
        const productos = await Productos.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}

export async function obteneProducto (req, res) {
    try {
        const { id } = req.params;
        const product = await Productos.findById({_id:id});
        if(!product) return res.send('The product does not exist');
        res.status(201).json({ok:true, product})  
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });

    }
}
export async function borrarProducto (req, res) {
    try {
        const { id } = req.params;
        const producto = await Productos.findById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        if (producto.public_id) {
            await cloudinary.uploader.destroy(producto.public_id);
            console.log('☁️ Imagen eliminada de Cloudinary');
        }
        await Productos.findByIdAndDelete(id);
        res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
        } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
}
export async function obtenerporTipo (req, res) {
    try {
        const { tipo } = req.params; 

        const validarTipo = ['accesorios', 'artilleria','aviacion', 'caballeria', 'comunicaciones', 'esculturas-militares','espro','infantería','ingenieros','inteligencia','logistica'];
        if (!validarTipo.includes(tipo)) {
            return res.status(400).json({ message: "Tipo de producto no válido" });
        }
        const productos = await Productos.find({ tipo }); 
        res.json(productos);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message }); 

    }
}

export async function obtenerImagenes(req, res) {
    try {
        const productos = await Productos.find({}, 'imagen');
        const imagenes = productos.map(p => p.imagen); // Ahora directamente Cloudinary URLs
        res.status(200).json({ imagenes });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message }); 

    }
}


export const obteneProductoNombre = async (req, res) => {
    try {
        const buscar = req.params.nombre || req.query.nombre;

        if (buscar) {
            const data = await Productos.find({
                nombre: { $regex: buscar, $options: 'i' }
            });
            res.status(200).json(data);
        } else {
            const dataProducts = await Productos.find();
            res.status(200).json(dataProducts);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error:   error.message  }); // ✅ envía un JSON legible con el mensaje
    }
};
