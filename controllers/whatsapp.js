const path = require('path');
const QRCode = require('qrcode');

// ✅ CORRECCIÓN CLAVE: Desestructuramos correctamente el objeto exportado
const { whatsappService, uploadMiddleware } = require('./whatsappService');

const Conversacion = require('./Conversacionschema');
const QuickReply = require('./QuickReplyschema');

// Usamos el middleware extraído
const upload = uploadMiddleware;

module.exports = function(app) {
    // ------------------------------------------------------------------------
    // CONEXIÓN Y ESTADO
    // ------------------------------------------------------------------------
    app.post('/api/whatsapp/conectar', async (req, res) => {
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

    app.get('/api/whatsapp/qr', async (req, res) => {
        const qr = whatsappService.getQRCode();
        if (!qr) {
            return res.status(404).json({ success: false, message: 'No hay QR disponible. Conecta primero.' });
        }
        try {
            const qrImage = await QRCode.toDataURL(qr);
            res.json({ success: true, data: qrImage });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

    app.get('/api/whatsapp/estado', (req, res) => {
        res.json({
            success: true,
            conectado: whatsappService.isConnected()
        });
    });

    // ------------------------------------------------------------------------
    // CONVERSACIONES
    // ------------------------------------------------------------------------
    app.get('/api/whatsapp/conversaciones', async (req, res) => {
        try {
            const conversaciones = await Conversacion.find()
                .sort({ ultimoMensaje: -1 })
                .limit(100);
            res.json({ success: true, data: conversaciones });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

    app.get('/api/whatsapp/conversaciones/:telefono', async (req, res) => {
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
    app.post('/api/whatsapp/enviar', async (req, res) => {
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

    app.post('/api/whatsapp/enviar-imagen', upload.single('image'), async (req, res) => {
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

    app.post('/api/whatsapp/enviar-audio', upload.single('audio'), async (req, res) => {
        try {
            const { telefono } = req.body;
            if (!telefono || !req.file) {
                return res.status(400).json({ success: false, message: 'Teléfono y audio requeridos' });
            }
            const inputPath = req.file.path;
            const outputPath = inputPath.replace(path.extname(inputPath), '.ogg');
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
    app.post('/api/whatsapp/typing', async (req, res) => {
        try {
            const { telefono, isTyping } = req.body;
            await whatsappService.sendTypingStatus(telefono, isTyping);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

    app.get('/api/whatsapp/typing/:telefono', async (req, res) => {
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
    app.get('/api/whatsapp/quick-replies/:vendedorId', async (req, res) => {
        try {
            const replies = await QuickReply.find({ vendedorId: req.params.vendedorId })
                .sort({ usoCount: -1, createdAt: -1 });
            res.json({ success: true, data: replies });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

    app.post('/api/whatsapp/quick-replies', async (req, res) => {
        try {
            const { vendedorId, titulo, mensaje, categoria } = req.body;
            const reply = new QuickReply({ vendedorId, titulo, mensaje, categoria });
            await reply.save();
            res.json({ success: true, data: reply });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

    app.post('/api/whatsapp/quick-replies/:id/use', async (req, res) => {
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
    app.post('/api/whatsapp/register-token', async (req, res) => {
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

        // ------------------------------------------------------------------------
    // 🔹 RESET AUTENTICACIÓN (eliminar auth_info para nuevo escaneo QR)
    // ------------------------------------------------------------------------
    app.delete('/api/whatsapp/auth', async (req, res) => {
        try {
            console.log('🔄 [ENDPOINT] Solicitud de reseteo de autenticación recibida');
            const result = await whatsappService.resetAuth();
            res.json({ 
                success: true, 
                message: '✅ Autenticación reseteada. Ahora puedes escanear un nuevo código QR.' 
            });
        } catch (error) {
            console.error('❌ [ENDPOINT] Error reseteando autenticación:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al resetear autenticación: ' + error.message 
            });
        }
    });

    console.log('✅ Rutas WhatsApp ARM registradas correctamente en app');
};