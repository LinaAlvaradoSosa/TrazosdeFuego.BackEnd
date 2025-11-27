import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  nombre: {
    type: String,
    require: true
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
}, { 
  versionKey: false,
  timestamps: true   
});

const Contact = mongoose.model('Contact', ContactSchema);
export default Contact;
