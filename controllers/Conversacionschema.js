const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  de: { type: String, enum: ['cliente', 'sistema', 'vendedor'], required: true },
  texto: { type: String, default: '' },
  tipo: { type: String, default: 'texto' }, // texto, imagen, audio
  mediaUrl: { type: String, default: null }, // URL for images/audio
  timestamp: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false }
});

const conversacionSchema = new mongoose.Schema({
  telefono: { type: String, required: true, unique: true, index: true },
  clienteId: { type: String, index: true }, // Link to your Cliente model
  nombreCliente: { type: String, default: '' },
  vendedorAsignado: { type: String, default: '' },
  mensajes: [mensajeSchema],
  estado: { 
    type: String, 
    enum: ['nuevo', 'activo', 'atendido', 'cerrado'], 
    default: 'nuevo' 
  },
  ultimoMensaje: { type: Date, default: Date.now },
   vendedorFcmToken: { type: String, default: null },
  metadata: {
    ultimaCotizacion: { type: String, default: null },
    totalCompras: { type: Number, default: 0 },
    productosFavoritos: [String],
     clienteEscribiendo: { type: Boolean, default: false },
    ultimoTyping: { type: Date, default: null }
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversacion', conversacionSchema);