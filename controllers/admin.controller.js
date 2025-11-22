import Admin from "../models/admin.model.js";
import Mensaje from "../models/contact.model.js";
import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

configDotenv();

// ✅ REGISTER: crea admin con contraseña encriptada
export async function register(req, res) {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre) {
      return res.status(400).send("El nombre es requerido");
    }
    if (!correo) {
      return res.status(400).send("El correo es requerido");
    }
    if (!contrasena) {
      return res.status(400).send("La contraseña es requerida");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!emailRegex.test(correo)) {
      return res.status(400).send("Utilice un correo válido");
    }

    if (!passwordRegex.test(contrasena)) {
      return res
        .status(400)
        .send(
          "La contraseña debe mezclar mayúsculas, minúsculas, un número y un carácter especial"
        );
    }

    const buscarAdmin = await Admin.findOne({ correo });
    if (buscarAdmin) {
      return res.status(400).send("El correo ya existe");
    }

    // 🔐 Encriptar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    const newAdmin = await Admin.create({
      nombre,
      correo,
      contrasena: hash,
    });

    return res.status(201).send(newAdmin);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Error en el servidor");
  }
}

// ✅ LOGIN: compara contraseña con bcrypt y genera token
export async function login(req, res) {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res
        .status(400)
        .json({ msj: "Correo y contraseña son requeridos" });
    }

    const findAdmin = await Admin.findOne({ correo });
    if (!findAdmin) {
      return res.status(401).json({ msj: "Credenciales inválidas" });
    }

    // 🔐 Comparar contraseña con el hash guardado
    const passwordMatch = await bcrypt.compare(
      contrasena,
      findAdmin.contrasena
    );

    if (!passwordMatch) {
      return res.status(401).json({ msj: "Credenciales inválidas" });
    }

    const payload = {
      id: findAdmin._id,
      correo: findAdmin.correo,
    };

    const KEY = process.env.SEGURITYKEY;
    const token = jwt.sign(payload, KEY, { expiresIn: "3h" });

    return res.status(200).json({
      token,
      id: findAdmin._id,
      nombre: findAdmin.nombre,
      correo: findAdmin.correo,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Error en el proceso de login, comuníquese con el admin",
    });
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
