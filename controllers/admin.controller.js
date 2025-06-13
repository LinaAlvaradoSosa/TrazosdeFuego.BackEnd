import { modelNames } from "mongoose";
import Admin from "../models/admin.model.js";
import Mensaje from "../models/contact.model.js"
import { configDotenv } from "dotenv";
import jwt  from "jsonwebtoken"

configDotenv();

export async function register(req, res) {
    try {
        const { nombre, correo, contrasena } = req.body
        if(!nombre) return res.send ('El nombre es requerido');
        if (!correo) return res.send ('El correo es requerido');
        if (!contrasena) return res.send ('La contrasena es requerida')
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if(!emailRegex.test(correo)) return res.send('Utilice un correo valido')
        if(!passwordRegex.test(contrasena)) return res.send ('La contrasena debe ser una mezcla de mayusculas, minusculas, un numero y un carácter especial')

        const buscarAdmin = await Admin.findOne({correo: correo});
        if(buscarAdmin) return res.send('El correo ya existe')
        
        const newAdmin = await Admin.create(req.body)
        
        return res.status(201).send(newAdmin)
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('error en el servidor')
    }
} 

export async function login (req, res) {
    try {
        const {correo, contrasena} = req.body;
        const findAdmin = await Admin.findOne({correo})
        if (!findAdmin) return res.send ('El correo no existe')

        if (findAdmin) {
            let clave = contrasena
            if (findAdmin.contrasena == clave) {
                let payload = {
                    id: findAdmin._id,
                    correo: `${findAdmin.correo}`
                }
                let KEY = process.env.SEGURITYKEY
                let token = jwt.sign(payload, KEY, {expiresIn: "3h"})
                res.status(200).json({token:token, id: findAdmin._id})
            } else {
                res.status(400).send({msj: "Credenciales invalidas"})
            }
        } else {
            res.status(400).send({msj:"Credenciales invalidas"})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: "error en el proceso de login, conmuniquese con el admin"})
    }
}

export async function actualizar (req, res) {
    const id = req.params.id
    const data = req.body

    try {
        const buscarAdmin = await Admin.findById({_id: id})
        if(!buscarAdmin) return res.send("Usuario no encontrado")

        const adminActualizado = await Admin.findByIdAndUpdate(id, data, { new: true })
        return res.send('Usuario actualizado')
        
    } catch (error) {
        console.log(error.message);
        return res.send('Error en el proceso de actualizacion de usuario, comuniquese con el admin')
    }
}

export async function guardarMensaje(req, res) {
    try {
        const { nombre, correo, mensaje, celular, tipo} = req.body;
        if (!nombre || !correo || !mensaje) return res.status(400).json({error: "Nombre, correo y mensaje son requeridos"})
        
        const nuevoMensaje = new Mensaje({ nombre, correo, mensaje, celular, tipo})
        await nuevoMensaje.save();
        res.status(201).json({message: "mensaje guardado con exito!"})
    } catch (error) {
        res.status(500).json({error: "Error al guardar el mensaje."})
    }
}
export async function mostrarMensajes(req, res) {
    try {
        const mensaje = await Mensaje.find()
        res.status(201).json({ok:true, mensaje})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: "Error, es posible mostrar los mensajes. Comunicate con el Admin"})
    }
}
export async function borrarMensaje(req, res) {
    try {
        const {id} = req.params;
        const buscarMensaje = await Mensaje.findById({_id: id});
        if (!buscarMensaje) return res.send('El mensaje no existe')
        
        const borrarMensaje = await Mensaje.findByIdAndDelete({_id: id})
        res.status(201).json({ok: true, borrarMensaje})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: "Error al borrar el mensaje"})
    } 
}
