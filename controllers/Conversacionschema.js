const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  de: { type: String, enum: ['cliente', 'sistema', 'vendedor'], required: true },
  texto: { type: String, default: '' },
  tipo: { type: String, default: 'texto' }, // texto, imagen, audio
  mediaUrl: { type: String, default: null }, // URL for images/audio
  timestamp: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false }
});

const mongoose = require('mongoose');

const ConversacionSchema = new mongoose.Schema({
    telefono: { type: String, required: true, unique: true, index: true },
    clienteId: { type: String, index: true },
    nombreCliente: { type: String, default: '' },
    vendedorAsignado: { type: String, default: '' },
    mensajes: [{
        de: { type: String, enum: ['cliente', 'sistema', 'vendedor'], required: true },
        texto: { type: String, default: '' },
        tipo: { type: String, default: 'texto' },
        mediaUrl: { type: String, default: null },
        timestamp: { type: Date, default: Date.now },
        leido: { type: Boolean, default: false }
    }],
    estado: { type: String, enum: ['nuevo', 'activo', 'atendido', 'cerrado'], default: 'nuevo' },
    ultimoMensaje: { type: Date, default: Date.now },
    vendedorFcmToken: { type: String, default: null },
    metadata: {
        clienteEscribiendo: { type: Boolean, default: false },
        ultimoTyping: { type: Date, default: null }
    }
}, { timestamps: true });

// ✅ CORRECCIÓN: Exportar el MODELO, no el Schema
module.exports = mongoose.model('Conversacion', ConversacionSchema);
