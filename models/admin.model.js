import mongoose from "mongoose";

const adminSchema = new mongoose.Schema ({
    nombre: {
        type: String,
        require: true, 
        trim: true
    },
    correo: {
        type: String,
        require: true,
        trim: true
    },
    contrasena: {
        type: String, 
        require: true,
        trim: true
    }
},{
    versionKey: false
}
);

const Admin = mongoose.model('Admin', adminSchema)
export default Admin