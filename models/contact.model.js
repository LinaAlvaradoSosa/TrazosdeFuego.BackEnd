import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema ({
    nombre: {
        type: String,
        requiere: true
    },
    correo: {
        type: String,
        require: true
    },
    mensaje: {
        type: String,
        require: true
    },
    celular: {
        type: String
    }
}, { versionKey: false});

const Contact = mongoose.model('Contact', ContactSchema);
export default Contact