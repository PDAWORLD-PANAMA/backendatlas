const mongoose = require('mongoose');

// ✅ 1. ADD THIS NEW SCHEMA FOR SUBSIDIARIES
const SucursalSchema = new mongoose.Schema({
    id_sucursal: { type: String, required: true },
    nombre_sucursal: { type: String, uppercase: true },
    direccion: { type: String, uppercase: true },
    telefono: { type: String },
    email: { type: String },
    rucNit: { type: String },
    contacto: { type: String },
    esPrincipal: { type: Boolean, default: false }
}, { _id: false }); // _id: false prevents Mongoose from creating a duplicat
 
module.exports = SucursalSchema;