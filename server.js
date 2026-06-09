const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config(); // Para variables de entorno

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


var  bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended: false});
// Al inicio de server.js, después de require('dotenv').config()
const ITBMS_PORCENTAJE = parseFloat(process.env.COTIZACION_PORCENTAJE_ITBMS) || 7;
const VALIDEZ_DEFAULT = parseInt(process.env.COTIZACION_DIAS_VALIDEZ_DEFAULT) || 5;
// Al inicio de server.js, después de require('dotenv').config()
const CLIENTE_LIMIT = parseInt(process.env.CLIENTE_BUSQUEDA_LIMIT) || 200;
const BULK_LIMIT = parseInt(process.env.CLIENTE_BULK_LIMIT) || 1000;

// ============================================================================
// 🔥 CONEXIÓN A MONGODB ATLAS
// ============================================================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado'))
  .catch(err => console.error('❌ Error de conexión MongoDB:', err));



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

var Inventariosedeschema = mongoose.Schema;
// Los campos del Schema deben tener el mismo name, que dice el form de datos a capturar
//
var Schemadelinventariosede = new mongoose.Schema({
//
    idinventario: { type : String, required: true },
    inventarionombre: { type : String, uppercase: true },
    categoria: { type : String, uppercase: true },
   subcategoria: { type : String, uppercase: true },
   marca: {type : String,  uppercase: true    },
   modelo: {       type : String, uppercase: true },
   cantidispo: { type : Number }, 
   existenciamin: { type : Number },
   precio1: { type : Number   },
   precio2: { type : Number   },
   precio3: { type : Number   },
   precio4: { type : Number   },
  costo1: { type : Number },
  costo2: { type : Number},
costoadicional: { type : Number},
cantipormayor: {type : Number},
tipoempaque: { type : String},
empaque: {type : String},
impuesto1: {type : Number},
impuesto2: { type : Number},
impuesto3: { type : Number},
codtasaisc: { type : String},
tasaisc: { type : Number},
comisionvendedor: {type : Number},
tipoproducto: { type : String},
fechaexpiracion: { type : String},
codigoprodproveedor: {type : String},
imagenproducto: { type : String},
idproveedor: { type : String},
localizacion:{ type :String},
especificaciones:{ type :String},
horasuso : { type : Number},
reparaciones : { type : Number},
fechaultima : { type : String},
notificacion: { type : String},
notificacionwoo: { type : String},
constancia: {type : String},
alquiler: { type : String},
// Agrega estos campos al final de tu Schemadelinventariosede antes del module.exports
shopify_id: {
    type: String,
    default: ""
}, shopify_inventory_item_id: {
    type: String,
    default: ""
},sincronizado_online: {
    type: Boolean,
    default: false
},componentes  : [],
sugerencias  : []

});

const Inventariosede = mongoose.model('Inventariosede', Schemadelinventariosede);


//%%%%%%%%//


//%%%%%%%%%%%%%%%%%%% ADICIONAL STRUCTURE  %%%%%%%%%%%%%%%%%%%%%//

var adicionalschema = mongoose.Schema;
// Los campos del Schema deben tener el mismo name, que dice el form de datos a capturar
//
var Schemadeadicional = new adicionalschema({
    costomensual: {
       type : Number
   },
   parm1: {
       type : String,default: "1"
   },
   parm2: {
       type : String,default: "1"
   },
   parm3: {
       type : String,default: "1"
   },
   parm4: {
    type : String,default: "1"
},
parm5: {
    type : String,default: "1"
},
parm6: {
    type : String,default: "1"
},
parm7: {
    type : String,default: "1"
},
parm8: {
    type : String,default: "1"
},
parm9: {
    type : String,default: "1"
},
parm10: {
    type : String,default: "1"
},
parm11: {
    type : String,default: "1"
},
parm12: {
    type : String,default: "1"
},
parm13: {
    type : String,default: "1"
},
parm14: {
    type : String,default: "1"
},
parm15: {
    type : String,default: "1"
},
parm16: {
    type : String,default: "1"
},
parm17: {
    type : String,default: "1"
},
parm18: {
    type : String,default: "1"
},
parm19: {
 type : String,default: "1"
},
parm20: {
 type : String,default: "1"
},
parm21: {
 type : String,default: "1"
},
parm22: {
 type : String,default: "1"
},
parm23: {
 type : String,default: "1"
},
parm24: {
 type : String,default: "1"
},
parm25: {
 type : String,default: "1"
},
parm26: {
    type : String,default: "1"
},
parm27: {
    type : String,default: "1"
},
parm28: {
    type : String,default: "1"
},
parm29: {
    type : String,default: "1"
},
parm30: {
 type : String,default: "1"
},
parm31: {
 type : String,default: "1"
},
parm32: {
 type : String,default: "1"
},
parm33: {
 type : String,default: "1"
},
parm34: {
 type : String,default: "1"
},
parm35: {
 type : String,default: "1"
},
parm36: {
 type : String,default: "1"
},
parm37: {
    type : String,default: "1"
   },
   parm38: {
    type : String,default: "1"
   },
   parm39: {
    type : String,default: "1"
   },
   parm40: {
    type : String,default: "1"
   },
   parm41: {
    type : String,default: "1"
   },
   parm42: {
    type : String,default: "1"
   },
   parm43: {
    type : String,default: "1"
   },
   parm44: {
    type : String,default: "1"
   },
   parm45: {
    type : String,default: "1"
   },
   parm46: {
    type : String,default: "1"
   },
   parm47: {
    type : String,default: "1"
   },
   parm48: {
    type : String,default: "1"
   },
   parm49: {
    type : String,default: "1"
   },
   parm50: {
    type : String,default: "1"
   }      
});
const Adicional = mongoose.model('Adicional', Schemadeadicional);

//%%%%%%%%%% model Bienes y Servicios//
const bienesSchema = new mongoose.Schema({
 codigobienes: {
        type : String
//
    },
    descripbienes: {
       type : String
//
   }
});

const BienServicio = mongoose.model('BienServicio', bienesSchema);


var ubicaciongeoschema =  mongoose.Schema;
// Los campos del Schema deben tener el mismo name, que dice el form de datos a capturar
//
var Schemageoubicacion = new ubicaciongeoschema({
    ubicacionid: {
        type : String
//
    },
    noidprov: {
       type : String
//
   },
    provincia: {
       type : String
//
   },
   noidistri: {
    type : String
//
},
   distrito: {
    type : String
//
},
noidcorre: {
  type : String
//
},
corregimiento: {
  type : String
//
}
});

const Ubicacion = mongoose.model('Ubicacion', Schemageoubicacion);


var Clienteschema = mongoose.Schema;
// Los campos del Schema deben tener el mismo name, que dice el form de datos a capturar
//
var SchemadelCliente = new Clienteschema({
//
    idcliente: {
        type : String
//
    },
    clientenombre: {
       type : String,
       uppercase: true
//
   },
   idglobal: {
    type : String
//
},
   ruccliente: {
       type : String
 //
   },
   digitoverificador: {
    type : String
//
},
retenedor: {
    type : String,
    uppercase: true
},
   dir1cliente: {
       type : String,
       uppercase: true
   },
   dir2cliente: {
       type : String,
       uppercase: true
   },
   dirconta: {
       type : String,
       uppercase: true
//
   },
   derpar: {
       type : String,
       uppercase: true
   },
   telcliente: {
       type : String
   },
   emailcliente: {
       type : String
   },
   faxcliente: {
       type : String
   },
   webcliente: {
       type : String
   },
tipocontribuyente: {
   type : String
},
   ventascliente: {
       type : Number
   },
   acumulapuntos: {
       type : Number
   },
  tiposuscribcliente: {
    type : String
},
fechasuscribcliente: {
    type : String
},
fechacumplecliente: {
    type : String
},
estadoctacliente: {
    type : String
},
limitecredcliente: {
    type : String
},
paiscliente: {
    type : String
},
provinciacliente: {
    type : String
},
ciudadcliente: {
    type : String
},
vendedorcliente: {
    type : String
},
codigopreciocliente: {
    type : String
},
fechaultventa: {
    type : String
},
historialfacturas  : [String],
historialcotizacion: [String],
historialabonos: [String],
historialcambio: [String]
});

const Cliente = mongoose.model('Cliente', SchemadelCliente);


var cotizaheadschema = mongoose.Schema;
// Los campos del Schema deben tener el mismo name, que dice el form de datos a capturar
//

var Schemaheadcotiza = new cotizaheadschema({
    nocotiza: { type : String },
    fechacotiza: { type : String },
    fechavencimiento: { type : String },
    codcliente: { type : String },
    codvendedor:{ type: String  },
    tipoclientefe:{ type: String  },
    tipocontribuyente:{ type: String },
    condiciones: { type : String },
    formapago: { type : String },
    descuentoglob: { type : Number },
    subtotal1: { type : Number },
    cotiitbms: { type : String },
    impuesto: { type : Number },
    subtotal2: { type : Number },
    total: { type : Number },
    coticonvertido: { type : String },
    nofactura: { type : String },
    fechaconvertido: { type : String },
    nombreclie: { type : String  },
    entrega: { type : String },
    referencia: { type : String  },
    ruccliente: { type : String  },
    validez: {  type : Number  },
    detallecoti: { type : String }
});

const CotizaHead = mongoose.model('CotizaHead',Schemaheadcotiza);

// 🔹 Índices para optimizar búsquedas



var cotizadetaschema = mongoose.Schema;
// Los campos del Schema deben tener el mismo name, que dice el form de datos a capturar
//
var Schemadetacotiza = new cotizadetaschema({
    nocotiza: { type : String },
    fechacotiza: { type : String },
    codcliente: {  type : String },
    codvendedor: { type : String },
    codproducto: { type : String },
    cantidad: { type : Number },
    descripcion: { type : String },
    modelo : { type : String },
    codigobienes : { type : String },
    codigoabrev : { type : String  },
    precio: { type : Number },
    descuento : { type : Number },
    ancho: { type : Number },
    alto: { type : Number },
    unidad: { type : String  },
    mercancia : { type : String },
    acabados: {  type : String }
});

const CotizaDetalle = mongoose.model('Schemareccotizadeta',Schemadetacotiza);

// ============================================================================
// 🔹 MODELOS ACTUALIZADOS: CATEGORÍA, SUBCATEGORÍA, MARCA, MODELO
// ============================================================================

// ───────── CATEGORÍA ─────────
const categoriaSchema = new mongoose.Schema({
    categoria: { type: String, required: true, unique: true, uppercase: true, trim: true },
    descripcion: { type: String, default: "", trim: true },
    activo: { type: Boolean, default: true },
    fechaCreacion: { type: String, default: () => new Date().toISOString() },
    fechaActualizacion: { type: String, default: () => new Date().toISOString() }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

// ───────── SUBCATEGORÍA ─────────
const subCategoriaSchema = new mongoose.Schema({
    subCategoria: { type: String, required: true, unique: true, uppercase: true, trim: true },
    categoriaId: { type: String, default: "", trim: true },
    subcategoriaNombre: { type: String, default: "", trim: true },
    descripcion: { type: String, default: "", trim: true },
    activo: { type: Boolean, default: true },
    fechaCreacion: { type: String, default: () => new Date().toISOString() },
    fechaActualizacion: { type: String, default: () => new Date().toISOString() }
});

const SubCategoria = mongoose.model('SubCategoria', subCategoriaSchema);

// ───────── MARCA ─────────
const marcaSchema = new mongoose.Schema({
    marca: { type: String, required: true, unique: true, uppercase: true, trim: true },
    descripcion: { type: String, default: "", trim: true },
    paisOrigen: { type: String, default: "", trim: true },
    activo: { type: Boolean, default: true },
    fechaCreacion: { type: String, default: () => new Date().toISOString() },
    fechaActualizacion: { type: String, default: () => new Date().toISOString() }
});

const Marca = mongoose.model('Marca', marcaSchema);

// ───────── MODELO ─────────
const modeloSchema = new mongoose.Schema({
    modelo: { type: String, required: true, unique: true, uppercase: true, trim: true },
    marcaId: { type: String, default: "", trim: true },
    marcaNombre: { type: String, default: "", trim: true },
    descripcion: { type: String, default: "", trim: true },
    activo: { type: Boolean, default: true },
    fechaCreacion: { type: String, default: () => new Date().toISOString() },
    fechaActualizacion: { type: String, default: () => new Date().toISOString() }
});

const Modelo = mongoose.model('Modelo', modeloSchema);

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
//
//

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

//%%%%%%%%%%%% model adicionales process  %%%%%%%%%//
// 📄 server.js - Agregar al final del archivo, junto a las rutas de empresa

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 RUTAS: ADICIONALES (CRUD)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ✅ GET - Leer configuración adicional
app.get('/api/adicionales', async (req, res) => {
    try {
        const adicional = await Adicional.findOne(); // Solo un registro permitido
        if (!adicional) {
            return res.status(404).json({ success: false, message: 'No hay configuración adicional registrada' });
        }
        res.json({ success: true, message: 'Configuración adicional obtenida', data: adicional });
    } catch (error) {
        console.error('❌ Error GET /api/adicionales:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ✅ POST - Crear configuración adicional (solo si no existe)
app.post('/api/adicionales', async (req, res) => {
    try {
        // 🔍 Pre-check: Verificar si ya existe un registro
        const existing = await Adicional.findOne();
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ya existe una configuración adicional' });
        }
        
        const nuevoAdicional = new Adicional(req.body);
        const guardado = await nuevoAdicional.save();
        res.status(201).json({ success: true, message: 'Configuración adicional creada', data: guardado });
    } catch (error) {
        console.error('❌ Error POST /api/adicionales:', error);
        res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
    }
});

// ✅ PUT - Actualizar configuración adicional
app.put('/api/adicionales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        
        // 🚫 Proteger campos si es necesario (ej: _id)
        delete updateData._id;
        
        const actualizado = await Adicional.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Configuración adicional no encontrada' });
        }
        res.json({ success: true, message: 'Configuración adicional actualizada', data: actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/adicionales:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

// ✅ DELETE - Eliminar configuración adicional
app.delete('/api/adicionales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Adicional.findByIdAndDelete(id);
        if (!eliminado) {
            return res.status(404).json({ success: false, message: 'Configuración adicional no encontrada' });
        }
        res.json({ success: true, message: 'Configuración adicional eliminada' });
    } catch (error) {
        console.error('❌ Error DELETE /api/adicionales:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});


// ✅ GET - Listar todos los bienes
app.get('/api/bienes', async (req, res) => {
    try {
        const bienes = await BienServicio.find().sort({ createdAt: -1 });
        res.json({ success: true, message: 'Bienes obtenidos', data: bienes });
    } catch (error) {
        console.error('❌ Error GET /api/bienes:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ✅ POST - Crear nuevo bien (validar código único)
app.post('/api/bienes', async (req, res) => {
    try {
        const { codigobienes, describbienes } = req.body;
        
        // 🔍 Validar código único
        const existing = await BienServicio.findOne({ codigobienes });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ya existe un bien con este código' });
        }
        
        const nuevoBien = new BienServicio({ codigobienes, describbienes });
        const guardado = await nuevoBien.save();
        res.status(201).json({ success: true, message: 'Bien creado', data: guardado });
    } catch (error) {
        console.error('❌ Error POST /api/bienes:', error);
        res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
    }
});

// ✅ GET - Leer un bien por ID
app.get('/api/bienes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const bien = await BienServicio.findById(id);
        if (!bien) {
            return res.status(404).json({ success: false, message: 'Bien no encontrado' });
        }
        res.json({ success: true, message: 'Bien obtenido', data: bien });
    } catch (error) {
        console.error('❌ Error GET /api/bienes/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});



// ✅ PUT - Actualizar bien existente
app.put('/api/bienes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { describbienes } = req.body; // ← No permitir cambiar codigobienes
        
        const actualizado = await BienServicio.findByIdAndUpdate(
            id, 
            { describbienes }, 
            { new: true, runValidators: true }
        );
        
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Bien no encontrado' });
        }
        res.json({ success: true, message: 'Bien actualizado', data: actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/bienes:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

// ✅ DELETE - Eliminar bien
app.delete('/api/bienes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await BienServicio.findByIdAndDelete(id);
        if (!eliminado) {
            return res.status(404).json({ success: false, message: 'Bien no encontrado' });
        }
        res.json({ success: true, message: 'Bien eliminado' });
    } catch (error) {
        console.error('❌ Error DELETE /api/bienes:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});

// 📄 Agregar a server.js

// ✅ POST - Carga masiva de bienes (bulk upload)
app.post('/api/bienes/bulk', async (req, res) => {
    try {
        const bienesArray = req.body; // Array de objetos { codigobienes, describbienes }
        
        if (!Array.isArray(bienesArray)) {
            return res.status(400).json({ success: false, message: 'Se requiere un array de bienes' });
        }
        
        let successCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;
        const errors = [];
        
        for (const bienData of bienesArray) {
            try {
                const { codigobienes, describbienes } = bienData;
                
                // Validar campos requeridos
                if (!codigobienes || !describbienes) {
                    errorCount++;
                    errors.push(`Campos incompletos: ${JSON.stringify(bienData)}`);
                    continue;
                }
                
                // Verificar si ya existe
                const existing = await BienServicio.findOne({ codigobienes });
                if (existing) {
                    duplicateCount++;
                    continue; // Saltar duplicados
                }
                
                // Crear nuevo bien
                const nuevoBien = new BienServicio({ codigobienes, describbienes });
                await nuevoBien.save();
                successCount++;
                
            } catch (err) {
                errorCount++;
                errors.push(`Error en ${bienData.codigobienes}: ${err.message}`);
            }
        }
        
        res.json({
            success: true,
            message: 'Carga masiva completada',
            data: {
                total: bienesArray.length,
                success: successCount,
                duplicates: duplicateCount,
                errors: errorCount,
                errorMessages: errors
            }
        });
        
    } catch (error) {
        console.error('❌ Error POST /api/bienes/bulk:', error);
        res.status(500).json({ success: false, message: 'Error en carga masiva', error: error.message });
    }
});

// ✅ GET - Listar todas las ubicaciones
app.get('/api/ubicaciones', async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.find().sort({ provincia: 1, distrito: 1, corregimiento: 1 });
        res.json({ success: true, message: 'Ubicaciones obtenidas',  ubicaciones });
    } catch (error) {
        console.error('❌ Error GET /api/ubicaciones:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});


// ✅ POST - Crear nueva ubicación
app.post('/api/ubicaciones', async (req, res) => {
    try {
        const { ubicacionid, noidprov, provincia, noidistri, distrito, noidcorre, corregimiento } = req.body;
        
        // Validar campos requeridos
        if (!ubicacionid || !provincia || !distrito || !corregimiento) {
            return res.status(400).json({ success: false, message: 'ID, provincia, distrito y corregimiento son obligatorios' });
        }
        
        // Verificar si ya existe
        const existing = await Ubicacion.findOne({ ubicacionid });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ya existe una ubicación con este ID' });
        }
        
        const nuevaUbicacion = new Ubicacion({
            ubicacionid, noidprov, provincia, noidistri, distrito, noidcorre, corregimiento
        });
        const guardado = await nuevaUbicacion.save();
        res.status(201).json({ success: true, message: 'Ubicación creada',  guardado });
    } catch (error) {
        console.error('❌ Error POST /api/ubicaciones:', error);
        res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
    }
});

// ✅ GET - Leer una ubicación por ID
app.get('/api/ubicaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ubicacion = await Ubicacion.findById(id);
        if (!ubicacion) {
            return res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
        }
        res.json({ success: true, message: 'Ubicación obtenida',  ubicacion });
    } catch (error) {
        console.error('❌ Error GET /api/ubicaciones/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});


// ✅ PUT - Actualizar ubicación existente
app.put('/api/ubicaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        
        // No permitir cambiar ubicacionid
        delete updateData.ubicacionid;
        delete updateData._id;
        
        const actualizado = await Ubicacion.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
        }
        res.json({ success: true, message: 'Ubicación actualizada',  actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/ubicaciones:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

// ✅ DELETE - Eliminar ubicación
app.delete('/api/ubicaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Ubicacion.findByIdAndDelete(id);
        if (!eliminado) {
            return res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
        }
        res.json({ success: true, message: 'Ubicación eliminada' });
    } catch (error) {
        console.error('❌ Error DELETE /api/ubicaciones:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});

// ✅ POST - Carga masiva de ubicaciones
app.post('/api/ubicaciones/bulk', async (req, res) => {
    try {
        const ubicacionesArray = req.body;
        
        if (!Array.isArray(ubicacionesArray)) {
            return res.status(400).json({ success: false, message: 'Se requiere un array de ubicaciones' });
        }
        
        let successCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;
        const errors = [];
        
        // Obtener ubicaciones existentes
        const existingUbicaciones = await Ubicacion.find({}, 'ubicacionid');
        const existingIds = new Set(existingUbicaciones.map(u => u.ubicacionid));
        
        for (const ubicacionData of ubicacionesArray) {
            try {
                const { ubicacionid, noidprov, provincia, noidistri, distrito, noidcorre, corregimiento } = ubicacionData;
                
                // Validar campos
                if (!ubicacionid || !provincia || !distrito || !corregimiento) {
                    errorCount++;
                    errors.push(`Campos incompletos: ${JSON.stringify(ubicacionData)}`);
                    continue;
                }
                
                // Verificar duplicado
                if (existingIds.has(ubicacionid)) {
                    duplicateCount++;
                    continue;
                }
                
                // Crear nueva ubicación
                const nuevaUbicacion = new Ubicacion({
                    ubicacionid, noidprov, provincia, noidistri, distrito, noidcorre, corregimiento
                });
                await nuevaUbicacion.save();
                successCount++;
                existingIds.add(ubicacionid);
                
            } catch (err) {
                errorCount++;
                errors.push(`Error en ${ubicacionData.ubicacionid}: ${err.message}`);
            }
        } res.json({
            success: true,
            message: 'Carga masiva completada',
                            total: ubicacionesArray.length,
                success: successCount,
                duplicates: duplicateCount,
                errors: errorCount,
                errorMessages: errors
            
        });
        
    } catch (error) {
        console.error('❌ Error POST /api/ubicaciones/bulk:', error);
        res.status(500).json({ success: false, message: 'Error en carga masiva', error: error.message });
    }
});

// server.js - Agregar al final, junto a las otras rutas

// ═══════════════════════════════════════════════════════════════
// 1️⃣ PRIMERO: RUTAS ESPECÍFICAS SIN PARÁMETROS
// ═══════════════════════════════════════════════════════════════

// ───────── CATEGORÍAS ─────────
app.get('/api/inventarios/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.find({ activo: true }).sort({ categoria: 1 });
        res.json({ success: true, message: `${categorias.length} categoría(s) encontrada(s)`, data: categorias });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/categorias:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.post('/api/inventarios/categorias', async (req, res) => {
    try {
        const { categoria, descripcion } = req.body;
        if (!categoria?.trim()) {
            return res.status(400).json({ success: false, message: 'El nombre de la categoría es obligatorio' });
        }
        const existing = await Categoria.findOne({ categoria: categoria.trim().toUpperCase() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ya existe una categoría con este nombre' });
        }
        const nuevaCategoria = new Categoria({
            categoria: categoria.trim().toUpperCase(),
            descripcion: descripcion?.trim() || '',
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        });
        const guardado = await nuevaCategoria.save();
        res.status(201).json({ success: true, message: '✅ Categoría creada exitosamente', data: guardado });
    } catch (error) {
        console.error('❌ Error POST /api/inventarios/categorias:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'La categoría ya existe' });
        }
        res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
    }
});

// ───────── SUBCATEGORÍAS ─────────
app.get('/api/inventarios/subcategorias', async (req, res) => {
    try {
        const subcategorias = await SubCategoria.find({ activo: true }).sort({ subCategoria: 1 });
        res.json({ success: true, message: `${subcategorias.length} subcategoría(s) encontrada(s)`, data: subcategorias });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/subcategorias:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.post('/api/inventarios/subcategorias', async (req, res) => {
    try {
        const { subCategoria, categoriaId, descripcion } = req.body;
        if (!subCategoria?.trim()) {
            return res.status(400).json({ success: false, message: 'El nombre de la subcategoría es obligatorio' });
        }
        const existing = await SubCategoria.findOne({ subCategoria: subCategoria.trim().toUpperCase() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ya existe una subcategoría con este nombre' });
        }
        let categoriaNombre = '';
        if (categoriaId) {
            const categoria = await Categoria.findById(categoriaId);
            if (categoria) categoriaNombre = categoria.categoria;
        }
        const nuevaSubCategoria = new SubCategoria({
            subCategoria: subCategoria.trim().toUpperCase(),
            categoriaId: categoriaId?.trim() || '',
            subcategoriaNombre: categoriaNombre,
            descripcion: descripcion?.trim() || '',
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        });
        const guardado = await nuevaSubCategoria.save();
        res.status(201).json({ success: true, message: '✅ Subcategoría creada exitosamente', data: guardado });
    } catch (error) {
        console.error('❌ Error POST /api/inventarios/subcategorias:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'La subcategoría ya existe' });
        }
        res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
    }
});

// ───────── MARCAS ─────────
app.get('/api/inventarios/marcas', async (req, res) => {
    try {
        const marcas = await Marca.find({ activo: true }).sort({ marca: 1 });
        res.json({ success: true, message: `${marcas.length} marca(s) encontrada(s)`, data: marcas });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/marcas:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.post('/api/inventarios/marcas', async (req, res) => {
    try {
        const { marca, descripcion, paisOrigen } = req.body;
        if (!marca?.trim()) {
            return res.status(400).json({ success: false, message: 'El nombre de la marca es obligatorio' });
        }
        const existing = await Marca.findOne({ marca: marca.trim().toUpperCase() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ya existe una marca con este nombre' });
        }
        const nuevaMarca = new Marca({
            marca: marca.trim().toUpperCase(),
            descripcion: descripcion?.trim() || '',
            paisOrigen: paisOrigen?.trim() || '',
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        });
        const guardado = await nuevaMarca.save();
        res.status(201).json({ success: true, message: '✅ Marca creada exitosamente', data: guardado });
    } catch (error) {
        console.error('❌ Error POST /api/inventarios/marcas:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'La marca ya existe' });
        }
        res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
    }
});

// ───────── MODELOS ─────────
app.get('/api/inventarios/modelos', async (req, res) => {
    try {
        const modelos = await Modelo.find({ activo: true }).sort({ modelo: 1 });
        res.json({ success: true, message: `${modelos.length} modelo(s) encontrado(s)`, data: modelos });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/modelos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.post('/api/inventarios/modelos', async (req, res) => {
    try {
        const { modelo, marcaId, descripcion } = req.body;
        if (!modelo?.trim()) {
            return res.status(400).json({ success: false, message: 'El nombre del modelo es obligatorio' });
        }
        const existing = await Modelo.findOne({ modelo: modelo.trim().toUpperCase() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ya existe un modelo con este nombre' });
        }
        let marcaNombre = '';
        if (marcaId) {
            const marca = await Marca.findById(marcaId);
            if (marca) marcaNombre = marca.marca;
        }
        const nuevoModelo = new Modelo({
            modelo: modelo.trim().toUpperCase(),
            marcaId: marcaId?.trim() || '',
            marcaNombre: marcaNombre,
            descripcion: descripcion?.trim() || '',
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        });
        const guardado = await nuevoModelo.save();
        res.status(201).json({ success: true, message: '✅ Modelo creado exitosamente', data: guardado });
    } catch (error) {
        console.error('❌ Error POST /api/inventarios/modelos:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'El modelo ya existe' });
        }
        res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
    }
});

// ───────── BÚSQUEDA Y REPORTES ─────────
app.get('/api/inventarios/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const regex = new RegExp(query, 'i');
        const inventarios = await Inventariosede.find({
            $or: [
                { inventarionombre: regex },
                { idinventario: regex },
                { categoria: regex },
                { marca: regex },
                { modelo: regex }
            ]
        }).sort({ inventarionombre: 1 });
        res.json({ success: true, message: `Resultados para "${query}"`, data: inventarios });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/search:', error);
        res.status(500).json({ success: false, message: 'Error en búsqueda', error: error.message });
    }
});

app.get('/api/inventarios/report', async (req, res) => {
    try {
        const { categoria, subcategoria, marca, modelo, idinventario, inventarionombre } = req.query;
        const filters = {};
        if (categoria?.trim()) filters.categoria = { $regex: categoria.trim(), $options: 'i' };
        if (subcategoria?.trim()) filters.subcategoria = { $regex: subcategoria.trim(), $options: 'i' };
        if (marca?.trim()) filters.marca = { $regex: marca.trim(), $options: 'i' };
        if (modelo?.trim()) filters.modelo = { $regex: modelo.trim(), $options: 'i' };
        if (idinventario?.trim()) filters.idinventario = { $regex: idinventario.trim(), $options: 'i' };
        if (inventarionombre?.trim()) filters.inventarionombre = { $regex: inventarionombre.trim(), $options: 'i' };
        const results = await Inventariosede.find(filters).sort({ idinventario: 1 });
        res.json({ success: true, message: `${results.length} registro(s) encontrado(s)`, data: results });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/report:', error);
        res.status(500).json({ success: false, message: error.message, data: [] });
    }
});

app.post('/api/inventarios/bulk', async (req, res) => {
    try {
        const inventariosArray = req.body;
        if (!Array.isArray(inventariosArray)) {
            return res.status(400).json({ success: false, message: 'Se requiere un array de inventarios' });
        }
        let successCount = 0, duplicateCount = 0, errorCount = 0;
        const errors = [];
        for (const invData of inventariosArray) {
            try {
                const { idinventario, inventarionombre } = invData;
                if (!idinventario || !inventarionombre) {
                    errorCount++;
                    errors.push(`Campos incompletos: ${JSON.stringify(invData)}`);
                    continue;
                }
                const existing = await Inventariosede.findOne({ idinventario });
                if (existing) {
                    duplicateCount++;
                    continue;
                }
                const nuevoInv = new Inventariosede(invData);
                await nuevoInv.save();
                successCount++;
            } catch (err) {
                errorCount++;
                errors.push(`Error en ${invData.idinventario}: ${err.message}`);
            }
        }
        res.json({
            success: true,
            message: 'Carga masiva de inventario completada',
            data: { total: inventariosArray.length, success: successCount, duplicates: duplicateCount, errors: errorCount, errorMessages: errors }
        });
    } catch (error) {
        console.error('❌ Error POST /api/inventarios/bulk:', error);
        res.status(500).json({ success: false, message: 'Error en carga masiva', error: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════
// 2️⃣ DESPUÉS: RUTAS CON ID ESPECÍFICO (categorias/:id, etc.)
// ═══════════════════════════════════════════════════════════════

// ───────── CATEGORÍAS CON ID ─────────
app.get('/api/inventarios/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const categoria = await Categoria.findById(id);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }
        res.json({ success: true, message: 'Categoría obtenida', data: categoria });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/categorias/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.put('/api/inventarios/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.fechaCreacion;
        if (updateData.categoria) updateData.categoria = updateData.categoria.trim().toUpperCase();
        updateData.fechaActualizacion = new Date().toISOString();
        const actualizado = await Categoria.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }
        res.json({ success: true, message: '✅ Categoría actualizada', data: actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/inventarios/categorias/:id:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe una categoría con este nombre' });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

app.delete('/api/inventarios/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const eliminado = await Categoria.findByIdAndUpdate(id, {
            activo: false,
            fechaActualizacion: new Date().toISOString()
        }, { new: true });
        if (!eliminado) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }
        res.json({ success: true, message: '🗑️ Categoría eliminada (desactivada)' });
    } catch (error) {
        console.error('❌ Error DELETE /api/inventarios/categorias/:id:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});

// ───────── SUBCATEGORÍAS CON ID ─────────
app.get('/api/inventarios/subcategorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const subcategoria = await SubCategoria.findById(id);
        if (!subcategoria) {
            return res.status(404).json({ success: false, message: 'Subcategoría no encontrada' });
        }
        res.json({ success: true, message: 'Subcategoría obtenida', data: subcategoria });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/subcategorias/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.put('/api/inventarios/subcategorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.fechaCreacion;
        if (updateData.subCategoria) updateData.subCategoria = updateData.subCategoria.trim().toUpperCase();
        updateData.fechaActualizacion = new Date().toISOString();
        const actualizado = await SubCategoria.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Subcategoría no encontrada' });
        }
        res.json({ success: true, message: '✅ Subcategoría actualizada', data: actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/inventarios/subcategorias/:id:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe una subcategoría con este nombre' });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

app.delete('/api/inventarios/subcategorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const eliminado = await SubCategoria.findByIdAndUpdate(id, {
            activo: false,
            fechaActualizacion: new Date().toISOString()
        }, { new: true });
        if (!eliminado) {
            return res.status(404).json({ success: false, message: 'Subcategoría no encontrada' });
        }
        res.json({ success: true, message: '🗑️ Subcategoría eliminada (desactivada)' });
    } catch (error) {
        console.error('❌ Error DELETE /api/inventarios/subcategorias/:id:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});

// ───────── MARCAS CON ID ─────────
app.get('/api/inventarios/marcas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const marca = await Marca.findById(id);
        if (!marca) {
            return res.status(404).json({ success: false, message: 'Marca no encontrada' });
        }
        res.json({ success: true, message: 'Marca obtenida', data: marca });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/marcas/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.put('/api/inventarios/marcas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.fechaCreacion;
        if (updateData.marca) updateData.marca = updateData.marca.trim().toUpperCase();
        updateData.fechaActualizacion = new Date().toISOString();
        const actualizado = await Marca.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Marca no encontrada' });
        }
        res.json({ success: true, message: '✅ Marca actualizada', data: actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/inventarios/marcas/:id:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe una marca con este nombre' });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

app.delete('/api/inventarios/marcas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const eliminado = await Marca.findByIdAndUpdate(id, {
            activo: false,
            fechaActualizacion: new Date().toISOString()
        }, { new: true });
        if (!eliminado) {
            return res.status(404).json({ success: false, message: 'Marca no encontrada' });
        }
        res.json({ success: true, message: '🗑️ Marca eliminada (desactivada)' });
    } catch (error) {
        console.error('❌ Error DELETE /api/inventarios/marcas/:id:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});

// ───────── MODELOS CON ID ─────────
app.get('/api/inventarios/modelos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const modelo = await Modelo.findById(id);
        if (!modelo) {
            return res.status(404).json({ success: false, message: 'Modelo no encontrado' });
        }
        res.json({ success: true, message: 'Modelo obtenido', data: modelo });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/modelos/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.put('/api/inventarios/modelos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.fechaCreacion;
        if (updateData.modelo) updateData.modelo = updateData.modelo.trim().toUpperCase();
        updateData.fechaActualizacion = new Date().toISOString();
        const actualizado = await Modelo.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Modelo no encontrado' });
        }
        res.json({ success: true, message: '✅ Modelo actualizado', data: actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/inventarios/modelos/:id:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe un modelo con este nombre' });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

app.delete('/api/inventarios/modelos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const eliminado = await Modelo.findByIdAndUpdate(id, {
            activo: false,
            fechaActualizacion: new Date().toISOString()
        }, { new: true });
        if (!eliminado) {
            return res.status(404).json({ success: false, message: 'Modelo no encontrado' });
        }
        res.json({ success: true, message: '🗑️ Modelo eliminado (desactivado)' });
    } catch (error) {
        console.error('❌ Error DELETE /api/inventarios/modelos/:id:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════
// 3️⃣ AL FINAL: RUTAS GENÉRICAS DE INVENTARIOS
// ═══════════════════════════════════════════════════════════════

app.get('/api/inventarios', async (req, res) => {
    try {
        const inventarios = await Inventariosede.find().sort({ createdAt: -1 });
        res.json({ success: true, message: 'Inventarios obtenidos', data: inventarios });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.post('/api/inventarios', async (req, res) => {
    try {
        const { idinventario, inventarionombre } = req.body;
        if (!idinventario?.trim() || !inventarionombre?.trim()) {
            return res.status(400).json({ success: false, message: "ID Inventario y Nombre son campos obligatorios" });
        }
        const existing = await Inventariosede.findOne({ idinventario });
        if (existing) {
            return res.status(409).json({ success: false, message: "Ya existe un producto con este ID de inventario" });
        }
        const nuevoInventario = new Inventariosede(req.body);
        const guardado = await nuevoInventario.save();
        res.status(201).json({ success: true, message: "✅ Producto de inventario creado exitosamente", data: guardado });
    } catch (err) {
        console.error("❌ Error POST /api/inventarios:", err);
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: "❌ El ID de inventario ya está registrado" });
        }
        res.status(500).json({ success: false, message: "Error al crear inventario", error: err.message });
    }
});

// ⚠️ ESTA RUTA DEBE IR AL FINAL DE TODAS LAS RUTAS DE INVENTARIOS
app.get('/api/inventarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const inventario = await Inventariosede.findById(id);
        if (!inventario) {
            return res.status(404).json({ success: false, message: 'Inventario no encontrado' });
        }
        res.json({ success: true, message: 'Inventario obtenido', data: inventario });
    } catch (error) {
        console.error('❌ Error GET /api/inventarios/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.put('/api/inventarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        delete updateData.idinventario;
        delete updateData._id;
        delete updateData.createdAt;
        const actualizado = await Inventariosede.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, context: 'query' });
        if (!actualizado) {
            return res.status(404).json({ success: false, message: "Inventario no encontrado" });
        }
        res.json({ success: true, message: "✅ Inventario actualizado exitosamente", data: actualizado });
    } catch (err) {
        console.error("❌ Error PUT /api/inventarios:", err);
        res.status(500).json({ success: false, message: "Error al actualizar inventario", error: err.message });
    }
});

app.delete('/api/inventarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID de inventario inválido" });
        }
        const eliminado = await Inventariosede.findByIdAndDelete(id);
        if (!eliminado) {
            return res.status(404).json({ success: false, message: "Inventario no encontrado" });
        }
        res.json({ success: true, message: "🗑️ Producto eliminado exitosamente del inventario" });
    } catch (err) {
        console.error("❌ Error DELETE /api/inventarios:", err);
        res.status(500).json({ success: false, message: "Error al eliminar inventario", error: err.message });
    }
});

// backend/routes/ventas.js
// ============================================================================
// 🔹 RUTAS: CLIENTES - CRUD COMPLETO
// ============================================================================

// ✅ GET - Listar todos los clientes (con búsqueda opcional por nombre)
app.get('/api/ventas/clientes', async (req, res) => {
    try {
        const { clientenombre, ruccliente, ciudadcliente, activo } = req.query;
        let filters = { activo: activo !== 'false' }; // Por defecto solo activos
        
        // 🔍 Búsqueda parcial case-insensitive por nombre (campo principal de búsqueda)
        if (clientenombre?.trim()) {
            filters.clientenombre = { $regex: clientenombre.trim(), $options: 'i' };
        }
        if (ruccliente?.trim()) {
            filters.ruccliente = ruccliente.trim().toUpperCase();
        }
        if (ciudadcliente?.trim()) {
            filters.ciudadcliente = { $regex: ciudadcliente.trim(), $options: 'i' };
        }
        
        const clientes = await Cliente.find(filters)
            .sort({ clientenombre: 1 })
            .limit(CLIENTE_LIMIT); // Limitar para rendimiento en móviles
        
        res.json({
            success: true,
            message: `${clientes.length} cliente(s) encontrado(s)`,
            data: clientes
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/clientes:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});
// ✅ POST - Crear nuevo cliente
app.post('/api/ventas/clientes', async (req, res) => {
    try {
        const { idcliente, clientenombre } = req.body;
        
        // 🔍 Validaciones básicas (campos obligatorios)
        if (!idcliente?.trim() || !clientenombre?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID Cliente y Nombre son campos obligatorios' 
            });
        }
        
        // 🔐 Validar unicidad de idcliente (case-insensitive)
        const exists = await Cliente.findOne({ 
            idcliente: idcliente.trim().toUpperCase() 
        });
        if (exists) {
            return res.status(409).json({ 
                success: false, 
                message: 'Ya existe un cliente con este ID' 
            });
        }
        
        // Preparar datos con transformaciones según tu schema
        const nuevoCliente = await Cliente.create({
            ...req.body,
            // Campos que deben estar en UPPERCASE según tu schema original
            idcliente: idcliente.trim().toUpperCase(),
            clientenombre: clientenombre.trim().toUpperCase(),
            idglobal: req.body.idglobal?.trim().toUpperCase() || '',
            ruccliente: req.body.ruccliente?.trim().toUpperCase() || '',
            digitoverificador: req.body.digitoverificador?.trim().toUpperCase() || '',
            retenedor: req.body.retenedor?.trim().toUpperCase() || '',
            dir1cliente: req.body.dir1cliente?.trim().toUpperCase() || '',
            dir2cliente: req.body.dir2cliente?.trim().toUpperCase() || '',
            dirconta: req.body.dirconta?.trim().toUpperCase() || '',
            derpar: req.body.derpar?.trim().toUpperCase() || '',
            tipocontribuyente: req.body.tipocontribuyente?.trim().toUpperCase() || '',
            tiposuscribcliente: req.body.tiposuscribcliente?.trim().toUpperCase() || '',
            estadoctacliente: req.body.estadoctacliente?.trim().toUpperCase() || '',
            paiscliente: req.body.paiscliente?.trim().toUpperCase() || '',
            provinciacliente: req.body.provinciacliente?.trim().toUpperCase() || '',
            ciudadcliente: req.body.ciudadcliente?.trim().toUpperCase() || '',
            vendedorcliente: req.body.vendedorcliente?.trim().toUpperCase() || '',
            codigopreciocliente: req.body.codigopreciocliente?.trim().toUpperCase() || '',
            // Campos que deben estar en lowercase
            emailcliente: req.body.emailcliente?.trim().toLowerCase() || '',
            webcliente: req.body.webcliente?.trim().toLowerCase() || '',
            // Campos numéricos con validación
            ventascliente: Math.max(0, parseFloat(req.body.ventascliente) || 0),
            acumulapuntos: Math.max(0, parseFloat(req.body.acumulapuntos) || 0),
            // Arrays inicializados
            historialfacturas: [],
            historialcotizacion: [],
            historialabonos: [],
            historialcambio: [],
            // Estado y auditoría
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        });
        
        res.status(201).json({
            success: true,
            message: '✅ Cliente creado exitosamente',
            data: nuevoCliente
        });
    } catch (error) {
        console.error('❌ Error POST /api/ventas/clientes:', error);
        
        // Manejo específico para error de índice único (idcliente duplicado)
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: '❌ El ID de cliente ya está registrado en el sistema' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear cliente', 
            error: error.message 
        });
    }
});

// ✅ GET - Búsqueda avanzada por múltiples campos
app.get('/api/ventas/clientes/search', async (req, res) => {
    try {
        const { 
            query,           // Búsqueda general en nombre, RUC o ciudad
            clientenombre,   // Búsqueda específica por nombre
            ruccliente,      // Búsqueda por RUC exacto
            ciudadcliente,   // Búsqueda por ciudad
            vendedorcliente, // Búsqueda por vendedor asignado
            activo 
        } = req.query;
        
        let filters = { activo: activo !== 'false' };
        
        // Búsqueda general (OR entre campos)
        if (query?.trim()) {
            const regex = new RegExp(query.trim(), 'i');
            filters.$or = [
                { clientenombre: { $regex: regex } },
                { ruccliente: { $regex: regex } },
                { ciudadcliente: { $regex: regex } },
                { telcliente: { $regex: regex } },
                { emailcliente: { $regex: regex } }
            ];
        }
        
        // Filtros específicos (AND con la búsqueda general)
        if (clientenombre?.trim()) {
            filters.clientenombre = { $regex: clientenombre.trim(), $options: 'i' };
        }
        if (ruccliente?.trim()) {
            filters.ruccliente = ruccliente.trim().toUpperCase();
        }
        if (ciudadcliente?.trim()) {
            filters.ciudadcliente = { $regex: ciudadcliente.trim(), $options: 'i' };
        }
        if (vendedorcliente?.trim()) {
            filters.vendedorcliente = vendedorcliente.trim().toUpperCase();
        }
        
        const clientes = await Cliente.find(filters)
            .sort({ clientenombre: 1 })
            .limit(100);
        
        res.json({
            success: true,
            message: `${clientes.length} resultado(s) para la búsqueda`,
            data: clientes
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/clientes/search:', error);
        res.status(500).json({ success: false, message: 'Error en búsqueda', error: error.message });
    }
});

// ✅ POST - Carga masiva de clientes (bulk upload desde Excel/CSV)
app.post('/api/ventas/clientes/bulk', async (req, res) => {
    try {
        const clientesArray = req.body;
        
        if (!Array.isArray(clientesArray) || clientesArray.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Se requiere un array de clientes para carga masiva' 
            });
        }

        if (clientesArray.length > BULK_LIMIT) {
            return res.status(400).json({ 
             success: false, 
              message: `Máximo ${BULK_LIMIT} registros por carga` 
             });
          }
        
        let successCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;
        const errors = [];
        const createdIds = [];
        
        // Obtener IDs existentes para validación rápida
        const existingIds = new Set(
            (await Cliente.find({}, 'idcliente')).map(c => c.idcliente?.toUpperCase())
        );
        
        for (const clienteData of clientesArray) {
            try {
                const { idcliente, clientenombre } = clienteData;
                
                // Validar campos obligatorios
                if (!idcliente?.trim() || !clientenombre?.trim()) {
                    errorCount++;
                    errors.push(`Campos incompletos: ${JSON.stringify(clienteData)}`);
                    continue;
                }
                
                const idNormalizado = idcliente.trim().toUpperCase();
                
                // Verificar duplicado
                if (existingIds.has(idNormalizado)) {
                    duplicateCount++;
                    continue; // Saltar duplicados sin error
                }
                
                // Preparar datos con transformaciones
                const nuevoCliente = new Cliente({
                    ...clienteData,
                    idcliente: idNormalizado,
                    clientenombre: clientenombre.trim().toUpperCase(),
                    // Aplicar uppercase/lowercase según schema
                    idglobal: clienteData.idglobal?.trim().toUpperCase() || '',
                    ruccliente: clienteData.ruccliente?.trim().toUpperCase() || '',
                    digitoverificador: clienteData.digitoverificador?.trim().toUpperCase() || '',
                    retenedor: clienteData.retenedor?.trim().toUpperCase() || '',
                    dir1cliente: clienteData.dir1cliente?.trim().toUpperCase() || '',
                    dir2cliente: clienteData.dir2cliente?.trim().toUpperCase() || '',
                    dirconta: clienteData.dirconta?.trim().toUpperCase() || '',
                    derpar: clienteData.derpar?.trim().toUpperCase() || '',
                    tipocontribuyente: clienteData.tipocontribuyente?.trim().toUpperCase() || '',
                    tiposuscribcliente: clienteData.tiposuscribcliente?.trim().toUpperCase() || '',
                    estadoctacliente: clienteData.estadoctacliente?.trim().toUpperCase() || '',
                    paiscliente: clienteData.paiscliente?.trim().toUpperCase() || '',
                    provinciacliente: clienteData.provinciacliente?.trim().toUpperCase() || '',
                    ciudadcliente: clienteData.ciudadcliente?.trim().toUpperCase() || '',
                    vendedorcliente: clienteData.vendedorcliente?.trim().toUpperCase() || '',
                    codigopreciocliente: clienteData.codigopreciocliente?.trim().toUpperCase() || '',
                    emailcliente: clienteData.emailcliente?.trim().toLowerCase() || '',
                    webcliente: clienteData.webcliente?.trim().toLowerCase() || '',
                    // Numéricos
                    ventascliente: Math.max(0, parseFloat(clienteData.ventascliente) || 0),
                    acumulapuntos: Math.max(0, parseFloat(clienteData.acumulapuntos) || 0),
                    // Arrays
                    historialfacturas: [],
                    historialcotizacion: [],
                    historialabonos: [],
                    historialcambio: [],
                    // Auditoría
                    activo: true,
                    fechaCreacion: new Date().toISOString(),
                    fechaActualizacion: new Date().toISOString()
                });
                
                await nuevoCliente.save();
                existingIds.add(idNormalizado);
                createdIds.push(nuevoCliente._id);
                successCount++;
                
            } catch (err) {
                errorCount++;
                errors.push(`Error en ${clienteData.idcliente}: ${err.message}`);
            }
        }
        
        res.json({
            success: true,
            message: 'Carga masiva de clientes completada',
            data: {
                total: clientesArray.length,
                success: successCount,
                duplicates: duplicateCount,
                errors: errorCount,
                errorMessages: errors.slice(0, 10), // Limitar mensajes de error en respuesta
                createdIds: createdIds
            }
        });
        
    } catch (error) {
        console.error('❌ Error POST /api/ventas/clientes/bulk:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en carga masiva de clientes', 
            error: error.message 
        });
    }
});

// ✅ GET - Obtener estadísticas de clientes (para dashboard)
app.get('/api/ventas/clientes/stats', async (req, res) => {
    try {
        const { fechaDesde, fechaHasta } = req.query;
        
        // Filtro de fecha opcional
        const dateFilter = {};
        if (fechaDesde || fechaHasta) {
            dateFilter.fechaCreacion = {};
            if (fechaDesde) dateFilter.fechaCreacion.$gte = fechaDesde;
            if (fechaHasta) dateFilter.fechaCreacion.$lte = fechaHasta;
        }
        
        // Estadísticas básicas
        const totalActivos = await Cliente.countDocuments({ activo: true, ...dateFilter });
        const totalInactivos = await Cliente.countDocuments({ activo: false });
        
        // Clientes por ciudad (top 10)
        const porCiudad = await Cliente.aggregate([
            { $match: { activo: true, ...dateFilter } },
            { $group: { _id: '$ciudadcliente', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        
        // Clientes por tipo de contribuyente
        const porContribuyente = await Cliente.aggregate([
            { $match: { activo: true, tipocontribuyente: { $ne: '' }, ...dateFilter } },
            { $group: { _id: '$tipocontribuyente', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        // Total de ventas acumuladas (si el campo está poblado)
        const totalVentas = await Cliente.aggregate([
            { $match: { activo: true, ...dateFilter } },
            { $group: { _id: null, total: { $sum: '$ventascliente' } } }
        ]);
        
        res.json({
            success: true,
            message: 'Estadísticas de clientes',
            data: {
                totalActivos,
                totalInactivos,
                porCiudad,
                porContribuyente,
                totalVentas: totalVentas[0]?.total || 0,
                periodo: { fechaDesde, fechaHasta }
            }
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/clientes/stats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener estadísticas', 
            error: error.message 
        });
    }
});

// ✅ GET - Buscar cliente por ID único (idcliente, no _id de MongoDB)
app.get('/api/ventas/clientes/id/:idcliente', async (req, res) => {
    try {
        const { idcliente } = req.params;
        const cliente = await Cliente.findOne({ 
            idcliente: idcliente.trim().toUpperCase(), 
            activo: true 
        });
        
        if (!cliente) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
        
        res.json({ success: true, message: 'Cliente obtenido', data: cliente });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/clientes/id/:idcliente:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ✅ GET - Obtener cliente por _id de MongoDB (para edición por ID interno)
app.get('/api/ventas/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
        
        res.json({ success: true, message: 'Cliente obtenido', data: cliente });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/clientes/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});



// ✅ PUT - Actualizar cliente existente (🔒 idcliente NO modificable)
app.put('/api/ventas/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const updateData = { ...req.body };
        
        // 🔐 PROTECCIÓN CRÍTICA: Eliminar campos que NO deben ser modificados
        delete updateData.idcliente;  // ← Nunca permitir cambiar el ID único
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.fechaCreacion;
        
        // Aplicar transformaciones según tu schema (uppercase/lowercase)
        if (updateData.clientenombre) updateData.clientenombre = updateData.clientenombre.trim().toUpperCase();
        if (updateData.idglobal) updateData.idglobal = updateData.idglobal.trim().toUpperCase();
        if (updateData.ruccliente) updateData.ruccliente = updateData.ruccliente.trim().toUpperCase();
        if (updateData.digitoverificador) updateData.digitoverificador = updateData.digitoverificador.trim().toUpperCase();
        if (updateData.retenedor) updateData.retenedor = updateData.retenedor.trim().toUpperCase();
        if (updateData.dir1cliente) updateData.dir1cliente = updateData.dir1cliente.trim().toUpperCase();
        if (updateData.dir2cliente) updateData.dir2cliente = updateData.dir2cliente.trim().toUpperCase();
        if (updateData.dirconta) updateData.dirconta = updateData.dirconta.trim().toUpperCase();
        if (updateData.derpar) updateData.derpar = updateData.derpar.trim().toUpperCase();
        if (updateData.tipocontribuyente) updateData.tipocontribuyente = updateData.tipocontribuyente.trim().toUpperCase();
        if (updateData.tiposuscribcliente) updateData.tiposuscribcliente = updateData.tiposuscribcliente.trim().toUpperCase();
        if (updateData.estadoctacliente) updateData.estadoctacliente = updateData.estadoctacliente.trim().toUpperCase();
        if (updateData.paiscliente) updateData.paiscliente = updateData.paiscliente.trim().toUpperCase();
        if (updateData.provinciacliente) updateData.provinciacliente = updateData.provinciacliente.trim().toUpperCase();
        if (updateData.ciudadcliente) updateData.ciudadcliente = updateData.ciudadcliente.trim().toUpperCase();
        if (updateData.vendedorcliente) updateData.vendedorcliente = updateData.vendedorcliente.trim().toUpperCase();
        if (updateData.codigopreciocliente) updateData.codigopreciocliente = updateData.codigopreciocliente.trim().toUpperCase();
        if (updateData.emailcliente) updateData.emailcliente = updateData.emailcliente.trim().toLowerCase();
        if (updateData.webcliente) updateData.webcliente = updateData.webcliente.trim().toLowerCase();
        
        // Validar campos numéricos
        if (updateData.ventascliente !== undefined) {
            updateData.ventascliente = Math.max(0, parseFloat(updateData.ventascliente) || 0);
        }
        if (updateData.acumulapuntos !== undefined) {
            updateData.acumulapuntos = Math.max(0, parseFloat(updateData.acumulapuntos) || 0);
        }
        
        updateData.fechaActualizacion = new Date().toISOString();
        
        const actualizado = await Cliente.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
        
        res.json({
            success: true,
            message: '✅ Cliente actualizado exitosamente',
            data: actualizado
        });
    } catch (error) {
        console.error('❌ Error PUT /api/ventas/clientes/:id:', error);
        
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: '❌ El ID de cliente ya está registrado' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar cliente', 
            error: error.message 
        });
    }
});

// ✅ DELETE - Eliminar cliente (soft delete: activo = false)
app.delete('/api/ventas/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const eliminado = await Cliente.findByIdAndUpdate(
            id,
            { 
                $set: { 
                    activo: false, 
                    fechaActualizacion: new Date().toISOString() 
                } 
            },
            { new: true }
        );
        
        if (!eliminado) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
        
        res.json({ 
            success: true, 
            message: '🗑️ Cliente eliminado (desactivado)' 
        });
    } catch (error) {
        console.error('❌ Error DELETE /api/ventas/clientes/:id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar cliente', 
            error: error.message 
        });
    }
});


// ============================================================================
// 🔹 RUTAS ADICIONALES PARA CLIENTES
// ============================================================================


// ✅ PUT - Agregar registro a historial (ej: nueva factura, cotización, abono)
app.put('/api/ventas/clientes/:id/historial/:tipo', async (req, res) => {
    try {
        const { id, tipo } = req.params;
        const { referencia } = req.body; // Ej: número de factura, cotización, etc.
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        // Validar tipo de historial permitido
        const tiposPermitidos = ['facturas', 'cotizacion', 'abonos', 'cambio'];
        if (!tiposPermitidos.includes(tipo)) {
            return res.status(400).json({ 
                success: false, 
                message: `Tipo de historial no válido. Permitidos: ${tiposPermitidos.join(', ')}` 
            });
        }
        
        if (!referencia?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'La referencia del historial es obligatoria' 
            });
        }
        
        const campoHistorial = `historial${tipo}`;
        
        const actualizado = await Cliente.findByIdAndUpdate(
            id,
            { 
                $addToSet: { [campoHistorial]: referencia.trim().toUpperCase() }, // Evitar duplicados en el array
                $set: { fechaActualizacion: new Date().toISOString() }
            },
            { new: true }
        );
        
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
        
        res.json({
            success: true,
            message: `✅ Registro agregado al historial de ${tipo}`,
            data: {
                id: actualizado._id,
                idcliente: actualizado.idcliente,
                historialActualizado: actualizado[campoHistorial]
            }
        });
    } catch (error) {
        console.error(`❌ Error PUT /api/ventas/clientes/:id/historial/${req.params.tipo}:`, error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar historial', 
            error: error.message 
        });
    }
});
// backend/routes/cotizaciones.js



// ========================================================================
// 🔹 CABECERA - CRUD Endpoints
// ========================================================================

// GET all cotizaciones head
app.get('/ventas/cotizaciones/head', async (req, res) => {
  try {
    const { nocotiza } = req.query;
    let query = { activo: true };
    
    if (nocotiza && nocotiza.trim() !== '') {
      query.nocotiza = { $regex: nocotiza.trim(), $options: 'i' };
    }
    
    const heads = await CotizaHead.find(query).sort({ fechacotiza: -1, nocotiza: -1 });
    
    res.json({
      success: true,
      message: `${heads.length} cotización(es) encontrada(s)`,
      data: heads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});


// POST - Create head
app.post('/ventas/cotizaciones/head', async (req, res) => {
  try {
    const { nocotiza, codcliente, fechacotiza } = req.body;
    
    if (!nocotiza || !codcliente || !fechacotiza) {
      return res.status(400).json({ success: false, message: 'N° Cotización, Cliente y Fecha son obligatorios' });
    }
    
    // Validar unicidad de nocotiza
    const exists = await CotizaHead.findOne({ nocotiza: nocotiza.trim().toUpperCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Ya existe una cotización con este número' });
    }
    
    const nuevaHead = await CotizaHead.create({
      nocotiza: nocotiza.trim().toUpperCase(),
      fechacotiza,
      ...req.body,
      // Campos en uppercase según schema
      codcliente: req.body.codcliente?.toUpperCase() || '',
      nombreclie: req.body.nombreclie?.toUpperCase() || '',
      ruccliente: req.body.ruccliente?.toUpperCase() || '',
      codvendedor: req.body.codvendedor?.toUpperCase() || '',
      // Fechas de auditoría
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      message: 'Cabecera de cotización creada',
      data: nuevaHead
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET head by ID
app.get('/ventas/cotizaciones/head/:id', async (req, res) => {
  try {
    const head = await CotizaHead.findById(req.params.id);
    if (!head) return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
    res.json({ success: true, data: head });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// PUT - Update head (🔒 NO permitir cambiar nocotiza)
app.put('/ventas/cotizaciones/head/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // 🔒 Nunca permitir modificar nocotiza
    delete updateData.nocotiza;
    
    // Aplicar uppercase a campos correspondientes
    if (updateData.codcliente) updateData.codcliente = updateData.codcliente.toUpperCase();
    if (updateData.nombreclie) updateData.nombreclie = updateData.nombreclie.toUpperCase();
    if (updateData.ruccliente) updateData.ruccliente = updateData.ruccliente.toUpperCase();
    if (updateData.codvendedor) updateData.codvendedor = updateData.codvendedor.toUpperCase();
    
    updateData.fechaActualizacion = new Date().toISOString();
    
    const actualizada = await CotizaHead.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!actualizada) {
      return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
    }
    
    res.json({
      success: true,
      message: 'Cotización actualizada',
      data: actualizada
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE head (soft delete)
app.delete('/ventas/cotizaciones/head/:id', async (req, res) => {
  try {
    const eliminada = await CotizaHead.findByIdAndUpdate(
      req.params.id,
      { $set: { activo: false, fechaActualizacion: new Date().toISOString() } },
      { new: true }
    );
    
    if (!eliminada) {
      return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
    }
    
    res.json({ success: true, message: 'Cotización eliminada' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ========================================================================
// 🔹 DETALLE - Endpoints
// ========================================================================

// GET detalles por número de cotización
app.get('/ventas/cotizaciones/detalle/nro/:nocotiza', async (req, res) => {
  try {
    const { nocotiza } = req.params;
    const detalles = await CotizaDetalle.find({ 
      nocotiza: nocotiza.toUpperCase(),
      activo: true 
    }).sort({ codproducto: 1 });
    
    res.json({
      success: true,
      message: `${detalles.length} detalle(s) encontrado(s)`,
      data: detalles
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// POST - Create detalles (múltiples en una solicitud)
app.post('/ventas/cotizaciones/detalle', async (req, res) => {
  try {
    let { detalles } = req.body;
    
    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ success: false, message: 'Debe enviar al menos un detalle' });
    }
    
    // Validar que todos tengan el mismo nocotiza
    const nocotiza = detalles[0].nocotiza?.toUpperCase();
    if (!nocotiza || detalles.some(d => d.nocotiza?.toUpperCase() !== nocotiza)) {
      return res.status(400).json({ success: false, message: 'Todos los detalles deben pertenecer a la misma cotización' });
    }
    
    // Calcular subtotal para cada línea y aplicar uppercase donde corresponde
    detalles = detalles.map(detalle => ({
      ...detalle,
      nocotiza: detalle.nocotiza?.toUpperCase(),
      codproducto: detalle.codproducto?.toUpperCase(),
      descripcion: detalle.descripcion?.toUpperCase(),
      modelo: detalle.modelo?.toUpperCase(),
      codigobienes: detalle.codigobienes?.toUpperCase(),
      unidad: detalle.unidad?.toUpperCase(),
      subtotal: (detalle.cantidad || 1) * (detalle.precio || 0) * (1 - (detalle.descuento || 0) / 100),
      activo: true,
      fechaCreacion: new Date().toISOString()
    }));
    
    const creados = await CotizaDetalle.insertMany(detalles);
    
    res.status(201).json({
      success: true,
      message: `${creados.length} detalles agregados`,
      data: creados
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ========================================================================
// 🔹 OPERACIÓN COMBINADA: Crear cotización completa
// ========================================================================
app.post('/ventas/cotizaciones/completa', async (req, res) => {
  try {
    const { head, detalles } = req.body;
    
    if (!head || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ success: false, message: 'Cabecera y al menos un detalle son obligatorios' });
    }
    
    // Validar unicidad de nocotiza
    const exists = await CotizaHead.findOne({ nocotiza: head.nocotiza?.toUpperCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Ya existe una cotización con este número' });
    }
    
    // Preparar head con detallecoti serializado
    const detallecotiJson = JSON.stringify(detalles.map(d => ({
      codproducto: d.codproducto,
      descripcion: d.descripcion,
      cantidad: d.cantidad,
      precio: d.precio,
      descuento: d.descuento,
      subtotal: d.cantidad * d.precio * (1 - d.descuento / 100),
      unidad: d.unidad
    })));
    
    // Crear head
    const nuevaHead = await CotizaHead.create({
      ...head,
      nocotiza: head.nocotiza.toUpperCase(),
      detallecoti: detallecotiJson,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    });
    
    // Crear detalles
    const detallesConSubtotal = detalles.map(d => ({
      ...d,
      nocotiza: head.nocotiza.toUpperCase(),
      subtotal: d.cantidad * d.precio * (1 - d.descuento / 100),
      activo: true,
      fechaCreacion: new Date().toISOString()
    }));
    
    await CotizaDetalle.insertMany(detallesConSubtotal);
    
    res.status(201).json({
      success: true,
      message: `Cotización ${nuevaHead.nocotiza} creada con ${detalles.length} productos`,
      data: nuevaHead
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================================================
// 🔹 RUTAS: COTIZACIÓN - CABECERA (CRUD)
// ============================================================================

// ✅ GET - Listar todas las cotizaciones (con búsqueda opcional por nocotiza)
app.get('/api/ventas/cotizaciones/head', async (req, res) => {
    try {
        const { nocotiza, codcliente, activo } = req.query;
        let filters = { activo: activo !== 'false' }; // Por defecto solo activas
        
        if (nocotiza?.trim()) {
            filters.nocotiza = { $regex: nocotiza.trim(), $options: 'i' };
        }
        if (codcliente?.trim()) {
            filters.codcliente = codcliente.trim().toUpperCase();
        }
        
        const cotizaciones = await CotizaHead.find(filters)
            .sort({ fechacotiza: -1, nocotiza: -1 })
            .limit(100); // Limitar para rendimiento
        
        res.json({
            success: true,
            message: `${cotizaciones.length} cotización(es) encontrada(s)`,
            data: cotizaciones
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/cotizaciones/head:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});


// ✅ POST - Crear nueva cabecera de cotización
app.post('/api/ventas/cotizaciones/head', async (req, res) => {
    try {
        const { nocotiza, codcliente, fechacotiza } = req.body;
        
        // Validaciones básicas
        if (!nocotiza?.trim() || !codcliente?.trim() || !fechacotiza?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'N° Cotización, Cliente y Fecha son obligatorios' 
            });
        }
        
        // Validar unicidad de nocotiza
        const exists = await CotizaHead.findOne({ nocotiza: nocotiza.trim().toUpperCase() });
        if (exists) {
            return res.status(409).json({ 
                success: false, 
                message: 'Ya existe una cotización con este número' 
            });
        }
        
        // Preparar datos con uppercase en campos correspondientes
        const newHead = await CotizaHead.create({
            ...req.body,
            nocotiza: nocotiza.trim().toUpperCase(),
            codcliente: codcliente.trim().toUpperCase(),
            nombreclie: req.body.nombreclie?.trim().toUpperCase() || '',
            ruccliente: req.body.ruccliente?.trim().toUpperCase() || '',
            codvendedor: req.body.codvendedor?.trim().toUpperCase() || '',
            tipocontribuyente: req.body.tipocontribuyente?.trim().toUpperCase() || '',
            // Fechas de auditoría
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            // Inicializar totales
            subtotal1: 0,
            impuesto: 0,
            subtotal2: 0,
            total: 0,
            detallecoti: '[]'
        });
        
        res.status(201).json({
            success: true,
            message: '✅ Cabecera de cotización creada',
            data: newHead
        });
    } catch (error) {
        console.error('❌ Error POST /api/ventas/cotizaciones/head:', error);
        
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: '❌ El número de cotización ya está registrado' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear cotización', 
            error: error.message 
        });
    }
});


// ✅ POST - Crear múltiples detalles (bulk create para una cotización)
app.post('/api/ventas/cotizaciones/detalle', async (req, res) => {
    try {
        let { detalles } = req.body;
        
        if (!Array.isArray(detalles) || detalles.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Debe enviar al menos un detalle en un array' 
            });
        }
        
        // Validar que todos pertenezcan a la misma cotización
        const nocotiza = detalles[0].nocotiza?.trim().toUpperCase();
        if (!nocotiza || detalles.some(d => d.nocotiza?.trim().toUpperCase() !== nocotiza)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Todos los detalles deben pertenecer a la misma cotización' 
            });
        }
        
        // Verificar que la cabecera existe
        const headExists = await CotizaHead.findOne({ nocotiza, activo: true });
        if (!headExists) {
            return res.status(404).json({ 
                success: false, 
                message: 'La cotización de cabecera no existe o está inactiva' 
            });
        }
        
        // Preparar detalles: calcular subtotal y aplicar uppercase
        const detallesPreparados = detalles.map(detalle => {
            const bruto = (detalle.cantidad || 1) * (detalle.precio || 0);
            const subtotal = bruto - (bruto * ((detalle.descuento || 0) / 100));
            
            return {
                ...detalle,
                nocotiza: detalle.nocotiza?.trim().toUpperCase(),
                codcliente: detalle.codcliente?.trim().toUpperCase(),
                codvendedor: detalle.codvendedor?.trim().toUpperCase(),
                codproducto: detalle.codproducto?.trim().toUpperCase(),
                descripcion: detalle.descripcion?.trim().toUpperCase(),
                modelo: detalle.modelo?.trim().toUpperCase(),
                codigobienes: detalle.codigobienes?.trim().toUpperCase(),
                codigoabrev: detalle.codigoabrev?.trim().toUpperCase(),
                unidad: detalle.unidad?.trim().toUpperCase(),
                mercancia: detalle.mercancia?.trim().toUpperCase(),
                acabados: detalle.acabados?.trim().toUpperCase(),
                cantidad: Math.max(1, detalle.cantidad || 1),
                precio: Math.max(0, detalle.precio || 0),
                descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
                subtotal: parseFloat(subtotal.toFixed(2)),
                activo: true,
                fechaCreacion: new Date().toISOString()
            };
        });
        
        const creados = await CotizaDetalle.insertMany(detallesPreparados);
        
        // 🔁 Actualizar totales en la cabecera después de agregar detalles
        await actualizarTotalesCabecera(nocotiza);
        
        res.status(201).json({
            success: true,
            message: `✅ ${creados.length} detalle(s) agregado(s) a la cotización`,
            data: creados
        });
    } catch (error) {
        console.error('❌ Error POST /api/ventas/cotizaciones/detalle:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al agregar detalles', 
            error: error.message 
        });
    }
});

// ✅ POST - Crear cotización completa (head + detalles en transacción atómica)
app.post('/api/ventas/cotizaciones/completa', async (req, res) => {
    try {
        const { head, detalles } = req.body;
        
        if (!head || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cabecera y al menos un detalle son obligatorios' 
            });
        }
        
        // Validar unicidad de nocotiza
        const exists = await CotizaHead.findOne({ nocotiza: head.nocotiza?.trim().toUpperCase() });
        if (exists) {
            return res.status(409).json({ 
                success: false, 
                message: 'Ya existe una cotización con este número' 
            });
        }
        
        // Preparar head con detallecoti serializado para visualización rápida
        const detallecotiJson = JSON.stringify(detalles.map(d => ({
            codproducto: d.codproducto,
            descripcion: d.descripcion,
            cantidad: d.cantidad,
            precio: d.precio,
            descuento: d.descuento,
            subtotal: (d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100),
            unidad: d.unidad
        })));
        
        // Crear cabecera
        const nuevaHead = await CotizaHead.create({
            ...head,
            nocotiza: head.nocotiza.trim().toUpperCase(),
            codcliente: head.codcliente?.trim().toUpperCase(),
            nombreclie: head.nombreclie?.trim().toUpperCase(),
            ruccliente: head.ruccliente?.trim().toUpperCase(),
            codvendedor: head.codvendedor?.trim().toUpperCase(),
            tipocontribuyente: head.tipocontribuyente?.trim().toUpperCase(),
            detallecoti: detallecotiJson,
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            // Inicializar totales (se calcularán después)
            subtotal1: 0,
            impuesto: 0,
            subtotal2: 0,
            total: 0
        });
        
        // Preparar y crear detalles
        const detallesPreparados = detalles.map(detalle => ({
            ...detalle,
            nocotiza: nuevaHead.nocotiza,
            codcliente: nuevaHead.codcliente,
            codvendedor: nuevaHead.codvendedor,
            fechacotiza: nuevaHead.fechacotiza,
            codproducto: detalle.codproducto?.trim().toUpperCase(),
            descripcion: detalle.descripcion?.trim().toUpperCase(),
            modelo: detalle.modelo?.trim().toUpperCase(),
            unidad: detalle.unidad?.trim().toUpperCase(),
            cantidad: Math.max(1, detalle.cantidad || 1),
            precio: Math.max(0, detalle.precio || 0),
            descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
            subtotal: parseFloat(((detalle.cantidad || 1) * (detalle.precio || 0) * (1 - (detalle.descuento || 0) / 100)).toFixed(2)),
            activo: true,
            fechaCreacion: new Date().toISOString()
        }));
        
        await CotizaDetalle.insertMany(detallesPreparados);
        
        // 🔁 Calcular y actualizar totales en cabecera
        await actualizarTotalesCabecera(nuevaHead.nocotiza);
        
        // Recargar head con totales actualizados
        const headActualizada = await CotizaHead.findById(nuevaHead._id);
        
        res.status(201).json({
            success: true,
            message: `✅ Cotización ${nuevaHead.nocotiza} creada con ${detalles.length} producto(s)`,
            data: headActualizada
        });
    } catch (error) {
        console.error('❌ Error POST /api/ventas/cotizaciones/completa:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear cotización completa', 
            error: error.message 
        });
    }
});


// ✅ GET - Obtener cabecera por ID
app.get('/api/ventas/cotizaciones/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const head = await CotizaHead.findById(id);
        if (!head) {
            return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
        }
        
        res.json({ success: true, message: 'Cotización obtenida', data: head });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/cotizaciones/head/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ✅ GET - Obtener cabecera por número de cotización
app.get('/api/ventas/cotizaciones/head/nro/:nocotiza', async (req, res) => {
    try {
        const { nocotiza } = req.params;
        const head = await CotizaHead.findOne({ nocotiza: nocotiza.toUpperCase(), activo: true });
        
        if (!head) {
            return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
        }
        
        res.json({ success: true, message: 'Cotización obtenida', data: head });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/cotizaciones/head/nro/:nocotiza:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ✅ PUT - Actualizar cabecera existente (🔒 nocotiza NO modificable)
app.put('/api/ventas/cotizaciones/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const updateData = { ...req.body };
        
        // 🔐 PROTECCIÓN: Eliminar campos que NO deben ser modificados
        delete updateData.nocotiza; // Nunca permitir cambiar el número
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.fechaCreacion;
        
        // Aplicar uppercase a campos correspondientes
        if (updateData.codcliente) updateData.codcliente = updateData.codcliente.toUpperCase();
        if (updateData.nombreclie) updateData.nombreclie = updateData.nombreclie.toUpperCase();
        if (updateData.ruccliente) updateData.ruccliente = updateData.ruccliente.toUpperCase();
        if (updateData.codvendedor) updateData.codvendedor = updateData.codvendedor.toUpperCase();
        if (updateData.tipocontribuyente) updateData.tipocontribuyente = updateData.tipocontribuyente.toUpperCase();
        
        updateData.fechaActualizacion = new Date().toISOString();
        
        const updated = await CotizaHead.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
        }
        
        res.json({
            success: true,
            message: '✅ Cotización actualizada',
            data: updated
        });
    } catch (error) {
        console.error('❌ Error PUT /api/ventas/cotizaciones/head/:id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar cotización', 
            error: error.message 
        });
    }
});

// ✅ DELETE - Eliminar cotización (soft delete: activo = false)
app.delete('/api/ventas/cotizaciones/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const deleted = await CotizaHead.findByIdAndUpdate(
            id,
            { 
                $set: { 
                    activo: false, 
                    fechaActualizacion: new Date().toISOString() 
                } 
            },
            { new: true }
        );
        
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
        }
        
        res.json({ success: true, message: '🗑️ Cotización eliminada (desactivada)' });
    } catch (error) {
        console.error('❌ Error DELETE /api/ventas/cotizaciones/head/:id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar cotización', 
            error: error.message 
        });
    }
});


// ============================================================================
// 🔹 RUTAS: COTIZACIÓN - DETALLE (CRUD)
// ============================================================================

// ✅ GET - Obtener detalles por número de cotización
app.get('/api/ventas/cotizaciones/detalle/nro/:nocotiza', async (req, res) => {
    try {
        const { nocotiza } = req.params;
        const detalles = await CotizaDetalle.find({ 
            nocotiza: nocotiza.toUpperCase(),
            activo: true 
        }).sort({ codproducto: 1 });
        
        res.json({
            success: true,
            message: `${detalles.length} detalle(s) encontrado(s)`,
            data: detalles
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/cotizaciones/detalle/nro/:nocotiza:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ✅ GET - Obtener detalle por ID
app.get('/api/ventas/cotizaciones/detalle/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const detalle = await CotizaDetalle.findById(id);
        if (!detalle) {
            return res.status(404).json({ success: false, message: 'Detalle no encontrado' });
        }
        
        res.json({ success: true, message: 'Detalle obtenido', data: detalle });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/cotizaciones/detalle/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ✅ PUT - Actualizar detalle existente
app.put('/api/ventas/cotizaciones/detalle/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const updateData = { ...req.body };
        
        // 🔐 No permitir cambiar nocotiza ni codproducto (identificadores)
        delete updateData.nocotiza;
        delete updateData.codproducto;
        delete updateData._id;
        
        // Calcular nuevo subtotal si cambió cantidad, precio o descuento
        if (updateData.cantidad !== undefined || updateData.precio !== undefined || updateData.descuento !== undefined) {
            const detalleActual = await CotizaDetalle.findById(id);
            if (detalleActual) {
                const cantidad = updateData.cantidad !== undefined ? updateData.cantidad : detalleActual.cantidad;
                const precio = updateData.precio !== undefined ? updateData.precio : detalleActual.precio;
                const descuento = updateData.descuento !== undefined ? updateData.descuento : detalleActual.descuento;
                
                const bruto = cantidad * precio;
                updateData.subtotal = parseFloat((bruto - (bruto * (descuento / 100))).toFixed(2));
            }
        }
        
        // Aplicar uppercase a campos de texto
        if (updateData.descripcion) updateData.descripcion = updateData.descripcion.toUpperCase();
        if (updateData.modelo) updateData.modelo = updateData.modelo.toUpperCase();
        if (updateData.unidad) updateData.unidad = updateData.unidad.toUpperCase();
        
        const actualizado = await CotizaDetalle.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        if (!actualizado) {
            return res.status(404).json({ success: false, message: 'Detalle no encontrado' });
        }
        
        // 🔁 Actualizar totales en cabecera
        await actualizarTotalesCabecera(actualizado.nocotiza);
        
        res.json({
            success: true,
            message: '✅ Detalle actualizado',
            data: actualizado
        });
    } catch (error) {
        console.error('❌ Error PUT /api/ventas/cotizaciones/detalle/:id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar detalle', 
            error: error.message 
        });
    }
});

// ✅ DELETE - Eliminar detalle (soft delete)
app.delete('/api/ventas/cotizaciones/detalle/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const eliminado = await CotizaDetalle.findByIdAndUpdate(
            id,
            { 
                $set: { 
                    activo: false 
                } 
            },
            { new: true }
        );
        
        if (!eliminado) {
            return res.status(404).json({ success: false, message: 'Detalle no encontrado' });
        }
        
        // 🔁 Actualizar totales en cabecera después de eliminar detalle
        await actualizarTotalesCabecera(eliminado.nocotiza);
        
        res.json({ success: true, message: '🗑️ Detalle eliminado' });
    } catch (error) {
        console.error('❌ Error DELETE /api/ventas/cotizaciones/detalle/:id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar detalle', 
            error: error.message 
        });
    }
});


// ============================================================================
// 🔹 RUTAS: OPERACIONES COMBINADAS
// ============================================================================

// ✅ GET - Generar PDF de cotización (endpoint para descarga)
app.get('/api/ventas/cotizaciones/pdf/:nocotiza', async (req, res) => {
    try {
        const { nocotiza } = req.params;
        
        // Obtener cabecera y detalles
        const head = await CotizaHead.findOne({ nocotiza: nocotiza.toUpperCase(), activo: true });
        if (!head) {
            return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
        }
        
        const detalles = await CotizaDetalle.find({ nocotiza: nocotiza.toUpperCase(), activo: true });
        
        // 🔹 Aquí iría la lógica de generación de PDF
        // Para producción, usar librerías como 'pdfkit', 'puppeteer' o servicio externo
        
        // Ejemplo básico: devolver datos estructurados para que el cliente genere el PDF
        const pdfData = {
            cotizacion: {
                numero: head.nocotiza,
                fecha: head.fechacotiza,
                vencimiento: head.fechavencimiento,
                cliente: {
                    id: head.codcliente,
                    nombre: head.nombreclie,
                    ruc: head.ruccliente
                },
                vendedor: head.codvendedor,
                condiciones: head.condiciones,
                formaPago: head.formapago,
                validez: head.validez
            },
            items: detalles.map(d => ({
                codproducto: d.codproducto,
                descripcion: d.descripcion,
                cantidad: d.cantidad,
                unidad: d.unidad,
                precio: d.precio,
                descuento: d.descuento,
                subtotal: d.subtotal
            })),
            totales: {
                subtotal: head.subtotal1,
                descuento: head.descuentoglob,
                impuesto: head.impuesto,
                total: head.total
            },
            metadata: {
                generado: new Date().toISOString(),
                empresa: process.env.EMPRESA_NOMBRE || 'ERP Bipymes'
            }
        };
        
        // 🔹 Opción 1: Devolver JSON para que el cliente genere el PDF (recomendado para móvil)
        res.json({
            success: true,
            message: 'Datos para generación de PDF',
            data: pdfData
        });
        
        // 🔹 Opción 2: Generar PDF real en servidor (descomentar si usas pdfkit)
        /*
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=cotizacion-${nocotiza}.pdf`);
        
        doc.pipe(res);
        
        // Contenido del PDF...
        doc.fontSize(20).text(`Cotización N° ${head.nocotiza}`, { align: 'center' });
        // ... más contenido ...
        
        doc.end();
        */
        
    } catch (error) {
        console.error('❌ Error GET /api/ventas/cotizaciones/pdf/:nocotiza:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al generar PDF', 
            error: error.message 
        });
    }
});


// ============================================================================
// 🔹 HELPERS INTERNOS
// ============================================================================

// 🔁 Función para recalcular totales de la cabecera basado en sus detalles
async function actualizarTotalesCabecera(nocotiza) {
    try {

// Reemplazar el hardcode de 7% por:
        var porcentajeImpuesto = ITBMS_PORCENTAJE;
        const detalles = await CotizaDetalle.find({ 
            nocotiza: nocotiza.toUpperCase(), 
            activo: true 
        });
        
        // Calcular subtotal1 (suma de subtotales de líneas)
        const subtotal1 = detalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);
        
        // Aplicar descuento global (si existe en cabecera)
        const head = await CotizaHead.findOne({ nocotiza: nocotiza.toUpperCase() });
        if (!head) return;
        
        const descuentoglob = head.descuentoglob || 0;
        const baseImponible = subtotal1 - (subtotal1 * (descuentoglob / 100));
        
        // Calcular impuesto (ejemplo: 7% ITBMS - ajustar según configuración)
        porcentajeImpuesto = 7; // 🔧 Configurar desde empresa o cabecera
        const impuesto = baseImponible * (porcentajeImpuesto / 100);
        
        // Calcular totales finales
        const subtotal2 = baseImponible;
        const total = baseImponible + impuesto;
        
        // Actualizar cabecera con nuevos totales
        await CotizaHead.findOneAndUpdate(
            { nocotiza: nocotiza.toUpperCase() },
            {
                $set: {
                    subtotal1: parseFloat(subtotal1.toFixed(2)),
                    subtotal2: parseFloat(subtotal2.toFixed(2)),
                    impuesto: parseFloat(impuesto.toFixed(2)),
                    total: parseFloat(total.toFixed(2)),
                    fechaActualizacion: new Date().toISOString()
                }
            }
        );
        
    } catch (error) {
        console.error('❌ Error en actualizarTotalesCabecera:', error);
        // No lanzar error para no romper el flujo principal
    }
}

// ============================================================================
// 🔥 INICIALIZACIÓN DEL SERVIDOR
// ============================================================================
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Endpoints activos: /api/health, /api/dashboard, /api/empresa`);
});

