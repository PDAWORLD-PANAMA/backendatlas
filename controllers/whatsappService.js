const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs'); 
const multer = require('multer');
// const sharp = require('sharp'); // Keep if you plan to process images later

const Conversacion = require('../controllers/Conversacionschema');
const Cliente = require('../controllers/Clienteschema');
const InventoryItem = require('../controllers/InventoryItemschema');

// Optional: Uncomment when you create the firebaseService file
// const firebaseService = require('../services/firebaseService');

class WhatsAppService {
  constructor() {
    this.sock = null;
    this.qrCode = null;
    this.connected = false;
    this.authFolder = path.join(__dirname, '../auth_info');
    
    // Create auth folder if not exists
    if (!fs.existsSync(this.authFolder)) {
      fs.mkdirSync(this.authFolder, { recursive: true });
    }

    // ✅ FIX 3: Move multer config inside constructor so it's attached to the instance
    const uploadDir = path.join(__dirname, '../uploads/media');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    });

    this.upload = multer({ 
      storage: this.storage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|mp3|wav|ogg|m4a/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) cb(null, true);
        else cb(new Error('Solo se permiten imágenes o audios'));
      }
    });
  }

  async connect() {
    // Evitar múltiples intentos de conexión simultáneos
    if (this.connecting) {
      console.log('⚠️ [BAILEYS] Ya se está intentando conectar, esperando...');
      return;
    }
    this.connecting = true;

    try {
      const { state, saveCreds } = await useMultiFileAuthState(this.authFolder);

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ['ERP BIPYMES', 'Chrome', '10.0'],
        // ✅ OPTIMIZACIONES CRÍTICAS PARA RENDER (Evita caídas por memoria)
        syncFullHistory: false,
        markOnlineOnConnect: false,
        defaultQueryTimeoutMs: 30000
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        console.log('📱 WhatsApp Connection:', connection);

        if (qr) {
          this.qrCode = qr;
          console.log('🔐 New QR Code generated - scan with WhatsApp');
        }

        if (connection === 'open') {
          this.connected = true;
          this.connecting = false;
          this.qrCode = null;
          console.log('✅ WhatsApp connected successfully');
        }

        if (connection === 'close') {
          this.connected = false;
          this.connecting = false;
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          console.log('❌ WhatsApp closed. Reason code:', statusCode);
          
          if (statusCode === DisconnectReason.loggedOut) {
            console.log('❌ Logged out. Deleting auth_info folder...');
            fs.rmSync(this.authFolder, { recursive: true, force: true });
            setTimeout(() => this.connect(), 3000);
          } else if (statusCode === DisconnectReason.connectionReplaced) {
             console.log('❌ Connection replaced (otro dispositivo inició sesión). Deleting auth...');
             fs.rmSync(this.authFolder, { recursive: true, force: true });
             setTimeout(() => this.connect(), 3000);
          } else {
            console.log('🔄 Reconnecting in 3 seconds...');
            setTimeout(() => this.connect(), 3000);
          }
        }
      });

      // ✅ LISTENER DE MENSAJES LIMPIO Y SIN DUPLICADOS
      this.sock.ev.on('messages.upsert', async (m) => {
        if (m.type === 'notify' && m.messages[0]) {
          const msg = m.messages[0];
          console.log('📥 [BAILEYS] messages.upsert event recibido');
          
          if (!msg.message) {
            console.log('⚠️ [BAILEYS] Mensaje sin contenido (ej. reacción, estado), ignorando');
            return;
          }
          if (msg.key.fromMe) {
            console.log('⚠️ [BAILEYS] Mensaje propio (fromMe: true), ignorando. Usa OTRO número para probar.');
            return;
          }
          
          console.log('✅ [BAILEYS] Procesando mensaje entrante de:', msg.key.remoteJid);
          await this.handleIncomingMessage(msg);
        }
      });

      // ✅ PRESENCE UPDATE (Typing indicator)
      this.sock.ev.on('presence.update', async ({ id, presences }) => {
        const numeroLimpio = id.split('@')[0];
        const presence = presences[id]?.type;
        
        if (presence === 'composing') {
          await Conversacion.updateOne(
            { telefono: numeroLimpio },
            { $set: { 'metadata.clienteEscribiendo': true, 'metadata.ultimoTyping': new Date() } }
          );
        } else {
          await Conversacion.updateOne(
            { telefono: numeroLimpio },
            { $set: { 'metadata.clienteEscribiendo': false } }
          );
        }
      });

    } catch (error) {
      console.error('❌ Error crítico en connect():', error);
      this.connecting = false;
    }
  }

  async enviarImagen(numero, imagePath, caption = '') {
    if (!this.connected || !this.sock) {
      throw new Error('WhatsApp not connected');
    }
    const jid = numero.includes('@') ? numero : `${numero}@s.whatsapp.net`;
    await this.sock.sendMessage(jid, { 
      image: { url: imagePath },
      caption: caption
    });
    console.log(`✅ Image sent to ${numero}`);
  }

  async enviarAudio(numero, audioPath) {
    if (!this.connected || !this.sock) {
      throw new Error('WhatsApp not connected');
    }
    const jid = numero.includes('@') ? numero : `${numero}@s.whatsapp.net`;
    await this.sock.sendMessage(jid, { 
      audio: { url: audioPath },
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true // Voice note mode
    });
    console.log(`✅ Audio sent to ${numero}`);
  } 

  async sendTypingStatus(numero, isTyping) {
    if (!this.connected || !this.sock) return;
    const jid = numero.includes('@') ? numero : `${numero}@s.whatsapp.net`;
    if (isTyping) {
      await this.sock.sendPresenceUpdate('composing', jid);
    } else {
      await this.sock.sendPresenceUpdate('available', jid);
    }
  }

  async handleIncomingMessage(msg) {
     console.log('🎯 [HANDLE] Iniciando handleIncomingMessage');
    try {
      const telefono = msg.key.remoteJid; 
      const numeroLimpio = telefono.split('@')[0];
      
      let texto = '';
      let tipo = 'texto';
      let mediaUrl = null;
      
      if (msg.message.imageMessage) {
        tipo = 'imagen';
        texto = msg.message.imageMessage.caption || '';
        const buffer = await this.sock.downloadMediaMessage(msg);
        const fileName = `${Date.now()}-client.jpg`;
        const filePath = path.join(__dirname, '../uploads/media', fileName);
        fs.writeFileSync(filePath, buffer);
        mediaUrl = `/uploads/media/${fileName}`;
      } 
      else if (msg.message.audioMessage) {
        tipo = 'audio';
        const buffer = await this.sock.downloadMediaMessage(msg);
        const fileName = `${Date.now()}-client.ogg`;
        const filePath = path.join(__dirname, '../uploads/media', fileName);
        fs.writeFileSync(filePath, buffer);
        mediaUrl = `/uploads/media/${fileName}`;
      }
      else {
        texto = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      }

      console.log(`📩 Message from ${numeroLimpio}: ${texto}`);

      // 1. Find or create conversation
      let conversacion = await Conversacion.findOne({ telefono: numeroLimpio });
      
      if (!conversacion) {
        const cliente = await Cliente.findOne({ 
          $or: [
            { telefono: numeroLimpio },
            { celular: numeroLimpio }
          ]
        });

        conversacion = new Conversacion({
          telefono: numeroLimpio,
          clienteId: cliente?.idcliente || null,
          nombreCliente: cliente?.clientenombre || 'Cliente Nuevo',
          vendedorAsignado: cliente?.vendedorcliente || '',
          estado: 'nuevo'
        });
        await conversacion.save();
      } 

      // 2. Save the message
      conversacion.mensajes.push({
        de: 'cliente',
        texto: texto,
        tipo: tipo,
        mediaUrl: mediaUrl,
        timestamp: new Date()
      });
      conversacion.ultimoMensaje = new Date();
      conversacion.estado = 'activo';
      await conversacion.save();

      // 3. Generate automatic ARM response
      const respuesta = await this.generarRespuestaARM(conversacion, texto);
      
      if (respuesta) {
        await this.enviarMensaje(telefono, respuesta);
        
        conversacion.mensajes.push({
          de: 'sistema',
          texto: respuesta,
          timestamp: new Date()
        });
        await conversacion.save();
      }

      // ✅ FIX 4: Removed 'mensaje.de' which was undefined. 
      // Since this is handleIncomingMessage, it's always from 'cliente'.
      if (conversacion.vendedorFcmToken) {
        try {
          // Uncomment when firebaseService is ready:
          // await firebaseService.sendNotification(
          //   conversacion.vendedorFcmToken,
          //   `Nuevo mensaje de ${conversacion.nombreCliente}`,
          //   texto.substring(0, 100),
          //   { telefono: conversacion.telefono, tipo: 'nuevo_mensaje' }
          // );
          console.log('🔔 Push notification ready for token:', conversacion.vendedorFcmToken);
        } catch (error) {
          console.error('Error sending push:', error);
        }
      }

    } catch (error) {
      console.error('❌ Error handling message:', error);
    }
  }

  // 🧠 THE BRAIN: ARM Logic
  async generarRespuestaARM(conversacion, mensaje) {
    const texto = mensaje.toLowerCase().trim();
    const cliente = conversacion.clienteId 
      ? await Cliente.findOne({ idcliente: conversacion.clienteId })
      : null;

    if (texto.match(/^(hola|buenos|buenas|hey|saludos)/)) {
      const nombre = cliente?.clientenombre || conversacion.nombreCliente;
      return `¡Hola ${nombre}! 👋 Soy el asistente virtual. ¿En qué puedo ayudarte hoy?\n\nPuedes preguntarme por:\n• Precios de productos\n• Estado de cotizaciones\n• Tu historial de compras\n• Hablar con tu vendedor`;
    }

    if (texto.includes('precio') || texto.includes('cuanto') || texto.includes('cuesta')) {
      const producto = await this.buscarProducto(texto);
      if (producto) {
        return `📦 *${producto.inventarioNombre}*\n💰 Precio: B/. ${producto.precio1.toFixed(2)}\n📊 Stock: ${producto.existenciaMin} unidades\n\n¿Te gustaría hacer una cotización?`;
      }
      return '¿Qué producto estás buscando? Dime el nombre o código y te paso el precio.';
    }

    if (texto.includes('cotizacion') || texto.includes('estado')) {
      if (cliente) {
        return `📋 Hola ${cliente.clientenombre}, para revisar el estado de tu cotización, tu vendedor asignado (${conversacion.vendedorAsignado || 'el equipo'}) te contactará en breve con los detalles actualizados.`;
      }
      return 'Para revisar cotizaciones necesito identificar tu cuenta. ¿Me puedes confirmar tu número de cliente o RUC?';
    }

    if (texto.includes('vendedor') || texto.includes('humano') || texto.includes('persona')) {
      conversacion.estado = 'atendido';
      await conversacion.save();
      return '✅ Perfecto, he notificado a tu vendedor asignado. Te contactará muy pronto. ¿Algo más en lo que pueda ayudarte mientras tanto?';
    }

    if (texto.includes('catalogo') || texto.includes('productos')) {
      return '📚 Nuestro catálogo completo está disponible. ¿Te interesa alguna categoría en particular?\n\n• Ferretería\n• Construcción\n• Herramientas\n• Eléctricos\n\nO dime qué producto específico buscas.';
    }

    if (cliente) {
      return `Gracias por tu mensaje, ${cliente.clientenombre}. He registrado tu consulta y tu vendedor asignado te responderá a la brevedad. ¿Hay algo urgente en lo que pueda ayudarte ahora?`;
    }

    return 'Gracias por contactarnos. Un asesor te atenderá en breve. Mientras tanto, ¿puedes indicarme qué necesitas?';
  }

  async buscarProducto(texto) {
    const palabras = texto.split(' ').filter(p => p.length > 3);
    for (const palabra of palabras) {
      const producto = await InventoryItem.findOne({
        inventarioNombre: { $regex: palabra, $options: 'i' }
      });
      if (producto) return producto;
    }
    return null;
  }

  async enviarMensaje(numero, texto) {
    if (!this.connected || !this.sock) {
      throw new Error('WhatsApp not connected');
    }
    const jid = numero.includes('@') ? numero : `${numero}@s.whatsapp.net`;
    await this.sock.sendMessage(jid, { text: texto });
    console.log(`✅ Message sent to ${numero}`);
  } 
    // ============================================================================
  // 🔹 RESET AUTH: Elimina credenciales para forzar nuevo escaneo de QR
  // ============================================================================
  async resetAuth() {
    console.log('🔄 [RESET AUTH] Iniciando proceso de reseteo de autenticación...');
    
    try {
      // 1. Cerrar la conexión actual si está activa
      if (this.sock) {
        console.log('🔌 [RESET AUTH] Cerrando socket de WhatsApp...');
        try {
          await this.sock.end();
        } catch (err) {
          console.warn('⚠️ [RESET AUTH] Error cerrando socket (continuando):', err.message);
        }
        this.sock = null;
      }
      
      // 2. Resetear estado de conexión
      this.connected = false;
      this.qrCode = null;
      
      // 3. Eliminar la carpeta auth_info recursivamente
      if (fs.existsSync(this.authFolder)) {
        console.log(`🗑️ [RESET AUTH] Eliminando carpeta: ${this.authFolder}`);
        fs.rmSync(this.authFolder, { recursive: true, force: true });
        console.log('✅ [RESET AUTH] Carpeta auth_info eliminada correctamente');
      } else {
        console.log('ℹ️ [RESET AUTH] La carpeta auth_info no existía');
      }
      
      // 4. Recrear la carpeta vacía para la próxima conexión
      fs.mkdirSync(this.authFolder, { recursive: true });
      console.log('✅ [RESET AUTH] Nueva carpeta auth_info creada');
      
      return { success: true, message: 'Autenticación reseteada. Escanea el nuevo QR.' };
      
    } catch (error) {
      console.error('❌ [RESET AUTH] Error crítico:', error);
      throw error;
    }
  }

  getQRCode() {
    return this.qrCode;
  }

  isConnected() {
    return this.connected;
  }
}

// Singleton instance
const whatsappService = new WhatsAppService();

// ✅ FIX 5: Export BOTH the service instance AND the upload middleware
module.exports = {
  whatsappService,
  uploadMiddleware: whatsappService.upload
};