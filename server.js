const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config(); // Para variables de entorno

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// 🔥 CONEXIÓN A MONGODB ATLAS
// ============================================================================
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/erpbipymes', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Atlas conectado"))
.catch(err => console.error("❌ Error de conexión MongoDB:", err));


// 🔥 MODELO
const Dashboard = mongoose.model("Dashboard", {
    ventasHoy: Number,
    facturasHoy: Number,
    ventasAyer: Number,
    facturasAyer: Number,
    ventasMes: Number,
    crecimiento: Number,
    cotizacionesTotal: Number,
    cotizacionesConvertidas: Number,
    cotizacionesNoConvertidas: Number,
    porcentajeConversion: Number,
    totalCotizado: Number,
    totalConvertido: Number
});

// models/EmpresaConfig.js

const empresaSchema = new mongoose.Schema({
    // 🔹 Datos básicos (obligatorios)
    empresa: { type: String, required: true, trim: true },
    rucempresa: { type: String, required: true, unique: true, trim: true },
    dir1empresa: { type: String, trim: true },
    dir2empresa: { type: String, trim: true },
    telefonoempresa: { type: String, trim: true },
    emailempresa: { type: String, lowercase: true, trim: true },
    faxempresa: { type: String, trim: true },
    webempresa: { type: String, trim: true },
    
    // 🔹 Contadores de documentos
    countordencompra: { type: String, default: "0" },
    countfactura: { type: String, default: "0" },
    countnotacredito: { type: String, default: "0" },
    countcompras: { type: String, default: "0" },
    countcxcobrar: { type: String, default: "0" },
    countcxpagar: { type: String, default: "0" },
    countdevolu: { type: String, default: "0" },
    countctacorriente: { type: String, default: "0" },
    countgastos: { type: String, default: "0" },
    countrequisi: { type: String, default: "0" },
    countdespacho: { type: String, default: "0" },
    countdeposito: { type: String, default: "0" },
    countrecnotas: { type: String, default: "0" },
    countranspagonotas: { type: String, default: "0" },
    
    // 🔹 Configuración del sistema
    interescxc: { type: String, default: "0" },
    sistemaprecio: { type: String, default: "1" }, // 1=Precio Lista, 2=Precio Especial
    sistemavendedor: { type: String, default: "1" }, // 1=Obligatorio, 2=Opcional
    tipodefactura: { type: String, default: "1" }, // Tipo de comprobante
    codigosucemisor: { type: String, trim: true },
    
    // 🔹 Tokens y seguridad
    tokenempresa: { type: String, trim: true },
    tokenclave: { type: String, trim: true },
    
    // 🔹 Facturación electrónica
    nofoliospac: { type: Number, default: 0 },
    firmadigitalemision: { type: String, trim: true },
    firmadigitalexpira: { type: String, trim: true },
    vigencialicencia: { type: String, trim: true },
    
}, { timestamps: true });

const EmpresaConfig = mongoose.model('EmpresaConfig', empresaSchema);



// 🔥 ENDPOINT
app.get("/api/dashboard", async (req, res) => {
    try {
        let data = await Dashboard.findOne();
        
        if (!data) {
            data = await Dashboard.create({
                ventasHoy: 1000,
                facturasHoy: 5,
                ventasAyer: 800,
                facturasAyer: 4,
                ventasMes: 12000,
                crecimiento: 25,
                cotizacionesTotal: 60,
                cotizacionesConvertidas: 40,
                cotizacionesNoConvertidas: 20,
                porcentajeConversion: 66,
                totalCotizado: 50000,
                totalConvertido: 30000,
                lastUpdated: new Date().toISOString()
            });
        }
        
        data.lastUpdated = new Date().toISOString();
        await data.save();
        
        res.json(data);
    } catch (err) {
        console.error("❌ Error /api/dashboard:", err);
        res.status(500).json({ message: "Error interno", error: err.message });
    }
});

// 🔥 IMPORTAR MODELO
const EmpresaConfig = require('./models/EmpresaConfig');

// ============================================================================
// 🔹 ENDPOINTS PARA EMPRESA CONFIG
// ============================================================================
// ✅ GET - Leer configuración de empresa
app.get("/api/empresa", async (req, res) => {
    try {
        const data = await EmpresaConfig.findOne();
        
        if (!data) {
            return res.status(404).json({ 
                success: false, 
                message: "No hay configuración de empresa registrada" 
            });
        }
        
        res.json({ success: true, data });
    } catch (err) {
        console.error("❌ Error GET /api/empresa:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor", 
            error: err.message 
        });
    }
});

// ✅ POST - Crear nueva configuración (SOLO UN REGISTRO PERMITIDO)
app.post("/api/empresa", async (req, res) => {
    try {
        const { rucempresa, empresa } = req.body;
        
        // Validación de campos obligatorios
        if (!rucempresa?.trim() || !empresa?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: "RUC y Nombre de Empresa son campos obligatorios" 
            });
        }
        
        // 🚫 Solo permitimos UN registro de configuración en el sistema
        const existing = await EmpresaConfig.findOne();
        if (existing) {
            return res.status(409).json({ 
                success: false, 
                message: "Ya existe una configuración registrada. Use PUT para actualizar",
                existingId: existing._id 
            });
        }
        
        const newConfig = await EmpresaConfig.create(req.body);
        
        res.status(201).json({ 
            success: true, 
            message: "✅ Configuración de empresa creada exitosamente", 
            data: newConfig 
        });
        
    } catch (err) {
        console.error("❌ Error POST /api/empresa:", err);
        
        // Manejo de error de índice único (RUC duplicado)
        if (err.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: "❌ El RUC ingresado ya está registrado en el sistema" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Error al crear configuración", 
            error: err.message 
        });
    }
});

// ✅ PUT - Actualizar configuración existente
// 🚫 RUC y dígito de verificación NO son modificables
app.put("/api/empresa/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        
        // 🔐 PROTECCIÓN: Eliminar campos que NO deben ser modificados
        delete updateData.rucempresa;
        delete updateData._id;
        delete updateData.createdAt;
        
        const updated = await EmpresaConfig.findByIdAndUpdate(
            id, 
            updateData, 
            { 
                new: true, 
                runValidators: true,
                context: 'query'
            }
        );
        
        if (!updated) {
            return res.status(404).json({ 
                success: false, 
                message: "Configuración no encontrada" 
            });
        }
        
        res.json({ 
            success: true, 
            message: "✅ Configuración actualizada exitosamente", 
            data: updated 
        });
        
    } catch (err) {
        console.error("❌ Error PUT /api/empresa:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error al actualizar configuración", 
            error: err.message 
        });
    }
});

// ✅ DELETE - Eliminar configuración de empresa
app.delete("/api/empresa/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "ID de configuración inválido" 
            });
        }
        
        const deleted = await EmpresaConfig.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false, 
                message: "Configuración no encontrada" 
            });
        }
        
        res.json({ 
            success: true, 
            message: "🗑️ Configuración eliminada exitosamente" 
        });
        
    } catch (err) {
        console.error("❌ Error DELETE /api/empresa:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error al eliminar configuración", 
            error: err.message 
        });
    }
});

// 🔹 Endpoint de salud del servidor
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "ok", 
        message: "Servidor ERP Bipymes funcionando", 
        timestamp: new Date().toISOString() 
    });
});

// 🔹 Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: `Endpoint no encontrado: ${req.method} ${req.originalUrl}` 
    });
});

// 🔹 Manejo global de errores
app.use((err, req, res, next) => {
    console.error("❌ Error no manejado:", err);
    res.status(500).json({ 
        success: false, 
        message: "Error interno del servidor", 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// ============================================================================
// 🔥 INICIALIZACIÓN DEL SERVIDOR
// ============================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Endpoints disponibles:`);
    console.log(`   • GET  /api/dashboard`);
    console.log(`   • GET  /api/empresa`);
    console.log(`   • POST /api/empresa`);
    console.log(`   • PUT  /api/empresa/:id`);
    console.log(`   • DELETE /api/empresa/:id`);
    console.log(`   • GET  /api/health`);
});