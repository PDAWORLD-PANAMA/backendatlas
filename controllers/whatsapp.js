const express = require('express');
const app = express();
const path = require('path'); // ✅ FIX 1: Added 'path' module (required for .extname and .basename)
const whatsappService = require('../controllers/whatsappService');
const Conversacion = require('../controllers/Conversacionschema');
const QuickReply = require('../controllers/QuickReplyschema');
const QRCode = require('qrcode');
// const firebaseService = require('../services/firebaseService'); // Uncomment when implementing push notifications

// ✅ FIX 2: Removed duplicate 'whatsappService' require. 
// Ensure your whatsappService.js exports the multer middleware like this: 
// module.exports = { WhatsAppServiceInstance, uploadMiddleware: upload };
const upload = whatsappService.uploadMiddleware; 

// ------------------------------------------------------------------------
// CONEXIÓN Y ESTADO
// ------------------------------------------------------------------------
app.post('/conectar', async (req, res) => {
  try {
    if (whatsappService.isConnected()) {
      return res.json({ success: true, message: 'Ya está conectado' });
    }
    await whatsappService.connect();
    res.json({ success: true, message: 'Conectando... Escanea el QR' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/qr', async (req, res) => {
  const qr = whatsappService.getQRCode();
  if (!qr) {
    return res.status(404).json({ success: false, message: 'No hay QR disponible. Conecta primero.' });
  }
  try {
    const qrImage = await QRCode.toDataURL(qr);
    res.json({ success: true, data: qrImage }); // ✅ Changed 'qr' to 'data' to match WhatsAppResponse<T>
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/estado', (req, res) => {
  res.json({ 
    success: true, 
    conectado: whatsappService.isConnected() 
  });
});

// ------------------------------------------------------------------------
// CONVERSACIONES
// ------------------------------------------------------------------------
app.get('/conversaciones', async (req, res) => {
  try {
    const conversaciones = await Conversacion.find()
      .sort({ ultimoMensaje: -1 })
      .limit(100);
    res.json({ success: true, data: conversaciones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/conversaciones/:telefono', async (req, res) => {
  try {
    const conversacion = await Conversacion.findOne({ 
      telefono: req.params.telefono 
    });
    if (!conversacion) {
      return res.status(404).json({ success: false, message: 'No encontrada' });
    }
    res.json({ success: true, data: conversacion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------------------------------------------------------------------------
// MENSAJERÍA
// ------------------------------------------------------------------------
app.post('/enviar', async (req, res) => {
  try {
    const { telefono, mensaje } = req.body;
    if (!telefono || !mensaje) {
      return res.status(400).json({ success: false, message: 'Teléfono y mensaje requeridos' });
    }
    
    await whatsappService.enviarMensaje(telefono, mensaje);
    
    let conversacion = await Conversacion.findOne({ telefono });
    if (!conversacion) {
      conversacion = new Conversacion({ telefono });
    }
    conversacion.mensajes.push({
      de: 'vendedor',
      texto: mensaje,
      tipo: 'texto',
      timestamp: new Date()
    });
    conversacion.ultimoMensaje = new Date();
    await conversacion.save();
    
    res.json({ success: true, message: 'Mensaje enviado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/enviar-imagen', upload.single('image'), async (req, res) => {
  try {
    const { telefono, caption } = req.body;
    if (!telefono || !req.file) {
      return res.status(400).json({ success: false, message: 'Teléfono e imagen requeridos' });
    }
    
    const imagePath = req.file.path;
    await whatsappService.enviarImagen(telefono, imagePath, caption || '');
    
    let conversacion = await Conversacion.findOne({ telefono });
    if (!conversacion) {
      conversacion = new Conversacion({ telefono });
    }
    conversacion.mensajes.push({
      de: 'vendedor',
      texto: caption || '',
      tipo: 'imagen',
      mediaUrl: `/uploads/media/${req.file.filename}`,
      timestamp: new Date()
    });
    conversacion.ultimoMensaje = new Date();
    await conversacion.save();
    
    res.json({ success: true, message: 'Imagen enviada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/enviar-audio', upload.single('audio'), async (req, res) => {
  try {
    const { telefono } = req.body;
    if (!telefono || !req.file) {
      return res.status(400).json({ success: false, message: 'Teléfono y audio requeridos' });
    }
    
    const inputPath = req.file.path;
    const outputPath = inputPath.replace(path.extname(inputPath), '.ogg');
    
    // Ensure ffmpeg is installed on your server (Render, Heroku, etc.)
    await require('child_process').promises.exec(
      `ffmpeg -i "${inputPath}" -c:a libopus -b:a 32k -ar 48000 -ac 1 "${outputPath}" -y`
    );
    
    await whatsappService.enviarAudio(telefono, outputPath);
    
    let conversacion = await Conversacion.findOne({ telefono });
    if (!conversacion) conversacion = new Conversacion({ telefono });
    conversacion.mensajes.push({
      de: 'vendedor',
      tipo: 'audio',
      mediaUrl: `/uploads/media/${path.basename(outputPath)}`,
      timestamp: new Date()
    });
    conversacion.ultimoMensaje = new Date();
    await conversacion.save();
    
    res.json({ success: true, message: 'Audio enviado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------------------------------------------------------------------------
// TYPING INDICATOR
// ------------------------------------------------------------------------
app.post('/typing', async (req, res) => {
  try {
    const { telefono, isTyping } = req.body;
    await whatsappService.sendTypingStatus(telefono, isTyping);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/typing/:telefono', async (req, res) => {
  try {
    const conversacion = await Conversacion.findOne({ telefono: req.params.telefono });
    res.json({ 
      success: true, 
      clienteEscribiendo: conversacion?.metadata?.clienteEscribiendo || false 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------------------------------------------------------------------------
// QUICK REPLIES
// ------------------------------------------------------------------------
app.get('/quick-replies/:vendedorId', async (req, res) => {
  try {
    const replies = await QuickReply.find({ vendedorId: req.params.vendedorId })
      .sort({ usoCount: -1, createdAt: -1 });
    res.json({ success: true, data: replies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/quick-replies', async (req, res) => {
  try {
    const { vendedorId, titulo, mensaje, categoria } = req.body;
    const reply = new QuickReply({ vendedorId, titulo, mensaje, categoria });
    await reply.save();
    res.json({ success: true, data: reply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/quick-replies/:id/use', async (req, res) => {
  try {
    await QuickReply.findByIdAndUpdate(req.params.id, { $inc: { usoCount: 1 } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ------------------------------------------------------------------------
// FCM TOKEN
// ------------------------------------------------------------------------
app.post('/register-token', async (req, res) => {
  try {
    const { vendedorId, fcmToken } = req.body;
    
    await Conversacion.updateMany(
      { vendedorAsignado: vendedorId },
      { $set: { vendedorFcmToken: fcmToken } }
    );
    
    res.json({ success: true, message: 'Token registrado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;