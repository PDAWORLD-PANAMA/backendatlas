const mongoose = require('mongoose');

const quickReplySchema = new mongoose.Schema({
  vendedorId: { type: String, required: true, index: true },
  titulo: { type: String, required: true },
  mensaje: { type: String, required: true },
  categoria: { type: String, default: 'general' }, // general, saludo, precio, despedida
  usoCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}); 
module.exports = quickReplySchema;
