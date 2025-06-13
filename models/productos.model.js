import mongoose from "mongoose";

const ProductosSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true
    },
    imagen: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        require: true
    }
},{versionKey: false})

const Producto = mongoose.model('Producto', ProductosSchema)
export default Producto