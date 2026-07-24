const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuración
const ITBMS_PORCENTAJE = parseFloat(process.env.COTIZACION_PORCENTAJE_ITBMS) || 7;
const VALIDEZ_DEFAULT = parseInt(process.env.COTIZACION_DIAS_VALIDEZ_DEFAULT) || 5;
const CLIENTE_LIMIT = parseInt(process.env.CLIENTE_BUSQUEDA_LIMIT) || 200;
const BULK_LIMIT = parseInt(process.env.CLIENTE_BULK_LIMIT) || 1000;

// ============================================================================
// 🔥 CONEXIÓN A MONGODB ATLAS
// ============================================================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado'))
  .catch(err => console.error('❌ Error de conexión MongoDB:', err));

// ============================================================================
// 🔥 MODELOS
// ============================================================================

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

const empresaSchema = new mongoose.Schema({
  empresa: { type: String, required: true, trim: true },
  rucempresa: { type: String, required: true, unique: true, trim: true },
  dir1empresa: { type: String, trim: true },
  dir2empresa: { type: String, trim: true },
  telefonoempresa: { type: String, trim: true },
  emailempresa: { type: String, lowercase: true, trim: true },
  faxempresa: { type: String, trim: true },
  webempresa: { type: String, trim: true },
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
  interescxc: { type: String, default: "0" },
  sistemaprecio: { type: String, default: "1" },
  sistemavendedor: { type: String, default: "1" },
  tipodefactura: { type: String, default: "1" },
  codigosucemisor: { type: String, trim: true },
  tokenempresa: { type: String, trim: true },
  tokenclave: { type: String, trim: true },
  nofoliospac: { type: Number, default: 0 },
  firmadigitalemision: { type: String, trim: true },
  firmadigitalexpira: { type: String, trim: true },
  vigencialicencia: { type: String, trim: true }
}, { timestamps: true });

const EmpresaConfig = mongoose.model('EmpresaConfig', empresaSchema);

const Schemadelinventariosede = new mongoose.Schema({
  idinventario: { type: String, required: true },
  inventarionombre: { type: String, uppercase: true },
  categoria: { type: String, uppercase: true },
  subcategoria: { type: String, uppercase: true },
  marca: { type: String, uppercase: true },
  modelo: { type: String, uppercase: true },
  cantidispo: { type: Number },
  existenciamin: { type: Number },
  precio1: { type: Number },
  precio2: { type: Number },
  precio3: { type: Number },
  precio4: { type: Number },
  costo1: { type: Number },
  costo2: { type: Number },
  costoadicional: { type: Number },
  cantipormayor: { type: Number },
  tipoempaque: { type: String },
  empaque: { type: String },
  unidad: { type: String },
  impuesto1: { type: Number },
  impuesto2: { type: Number },
  impuesto3: { type: Number },
  codtasaisc: { type: String },
  tasaisc: { type: Number },
  comisionvendedor: { type: Number },
  tipoproducto: { type: String },
  fechaexpiracion: { type: String },
  codigoprodproveedor: { type: String },
  imagenproducto: { type: String },
  idproveedor: { type: String },
  localizacion: { type: String },
  especificaciones: { type: String },
  horasuso: { type: Number },
  reparaciones: { type: Number },
  fechaultima: { type: String },
  notificacion: { type: String },
  notificacionwoo: { type: String },
  constancia: { type: String },
  alquiler: { type: String },
  shopify_id: { type: String, default: "" },
  shopify_inventory_item_id: { type: String, default: "" },
  sincronizado_online: { type: Boolean, default: false },
  componentes: [],
  sugerencias: []
});

const Inventariosede = mongoose.model('Inventariosede', Schemadelinventariosede);

const Schemadeadicional = new mongoose.Schema({
  costomensual: { type: Number },
  parm1: { type: String, default: "1" },
  parm2: { type: String, default: "1" },
  parm3: { type: String, default: "1" },
  parm4: { type: String, default: "1" },
  parm5: { type: String, default: "1" },
  parm6: { type: String, default: "1" },
  parm7: { type: String, default: "1" },
  parm8: { type: String, default: "1" },
  parm9: { type: String, default: "1" },
  parm10: { type: String, default: "1" },
  parm11: { type: String, default: "1" },
  parm12: { type: String, default: "1" },
  parm13: { type: String, default: "1" },
  parm14: { type: String, default: "1" },
  parm15: { type: String, default: "1" },
  parm16: { type: String, default: "1" },
  parm17: { type: String, default: "1" },
  parm18: { type: String, default: "1" },
  parm19: { type: String, default: "1" },
  parm20: { type: String, default: "1" },
  parm21: { type: String, default: "1" },
  parm22: { type: String, default: "1" },
  parm23: { type: String, default: "1" },
  parm24: { type: String, default: "1" },
  parm25: { type: String, default: "1" },
  parm26: { type: String, default: "1" },
  parm27: { type: String, default: "1" },
  parm28: { type: String, default: "1" },
  parm29: { type: String, default: "1" },
  parm30: { type: String, default: "1" },
  parm31: { type: String, default: "1" },
  parm32: { type: String, default: "1" },
  parm33: { type: String, default: "1" },
  parm34: { type: String, default: "1" },
  parm35: { type: String, default: "1" },
  parm36: { type: String, default: "1" },
  parm37: { type: String, default: "1" },
  parm38: { type: String, default: "1" },
  parm39: { type: String, default: "1" },
  parm40: { type: String, default: "1" },
  parm41: { type: String, default: "1" },
  parm42: { type: String, default: "1" },
  parm43: { type: String, default: "1" },
  parm44: { type: String, default: "1" },
  parm45: { type: String, default: "1" },
  parm46: { type: String, default: "1" },
  parm47: { type: String, default: "1" },
  parm48: { type: String, default: "1" },
  parm49: { type: String, default: "1" },
  parm50: { type: String, default: "1" }
});

const Adicional = mongoose.model('Adicional', Schemadeadicional);

const bienesSchema = new mongoose.Schema({
  codigobienes: { type: String },
  descripbienes: { type: String }
});

const BienServicio = mongoose.model('BienServicio', bienesSchema);

const Schemageoubicacion = new mongoose.Schema({
  ubicacionid: { type: String },
  descripubicacion: { type: String },
});

const Ubicacion = mongoose.model('Ubicacion', Schemageoubicacion);

const SchemadelCliente = new mongoose.Schema({
  idcliente: { type: String },
  clientenombre: { type: String, uppercase: true },
  idglobal: { type: String },
  ruccliente: { type: String },
  digitoverificador: { type: String },
  retenedor: { type: String, uppercase: true },
  dir1cliente: { type: String, uppercase: true },
  dir2cliente: { type: String, uppercase: true },
  dirconta: { type: String, uppercase: true },
  derpar: { type: String, uppercase: true },
  telcliente: { type: String },
  emailcliente: { type: String },
  faxcliente: { type: String },
  webcliente: { type: String },
  tipocontribuyente: { type: String },
  tipoclientefe: { type: String },
  ventascliente: { type: Number },
  acumulapuntos: { type: Number },
  tiposuscribcliente: { type: String },
  fechasuscribcliente: { type: String },
  fechacumplecliente: { type: String },
  estadoctacliente: { type: String },
  limitecredcliente: { type: String },
  paiscliente: { type: String },
  provinciacliente: { type: String },
  clasecliente: { type: String },
  createdAt: { type: String },
  ciudadcliente: { type: String },
  vendedorcliente: { type: String },
  codigopreciocliente: { type: String },
  fechaultventa: { type: String },
  historialfacturas: [String],
  historialcotizacion: [String],
  historialabonos: [String],
  historialcambio: [String]
});

const Cliente = mongoose.model('Cliente', SchemadelCliente);


var Vendedorschema = mongoose.Schema;
// Los campos del Schema deben tener el mismo name, que dice el form de datos a capturar
//
var SchemadelVendedor = new Vendedorschema({
    idvendedor: { type : String },
    vendenombre: { type : String, uppercase: true },
   tipovendedor: { type : String},
   dir1vende: { type : String, uppercase: true },
   dir2vende: { type : String, uppercase: true },
   telvende: { type : String },
   emailvende: { type : String },
   ventasvende: { type : Number }
});

const Vendedor = mongoose.model('Vendedor', SchemadelVendedor);


const Schemaheadcotiza = new mongoose.Schema({
  nocotiza: { type: String },
  fechacotiza: { type: String },
  fechavencimiento: { type: String },
  codcliente: { type: String },
  codvendedor: { type: String },
  tipoclientefe: { type: String },
  tipocontribuyente: { type: String },
  tipodocumento:  { type: String },
  tiponaturaleza :   { type: String },
  condiciones: { type: String },
  retenedor : { type: String }, 
  clasecliente : { type : String},   
  formapago: { type: String },
  descuentoglob: { type: Number },
  subtotal1: { type: Number },
  cotiitbms: { type: String },
  impuesto: { type: Number },
  subtotal2: { type: Number },
  total: { type: Number },
  coticonvertido: { type: String },
  nofactura: { type: String },
  fechaconvertido: { type: String },
  nombreclie: { type: String },
  entrega: { type: String },
  referencia: { type: String },
  ruccliente: { type: String },
  validez: { type: Number },
  detallecoti: { type: String },
  activo : { type: String },
  fechaCreacion: { type: String, default: () => new Date().toISOString() },
  fechaActualizacion: { type: String, default: () => new Date().toISOString() }
});

const CotizaHead = mongoose.model('CotizaHead', Schemaheadcotiza);

const Schemadetacotiza = new mongoose.Schema({
  nocotiza: { type: String },
  fechacotiza: { type: String },
  codcliente: { type: String },
  codvendedor: { type: String },
  codproducto: { type: String },
  cantidad: { type: Number },
  descripcion: { type: String },
  modelo: { type: String },
  codigobienes: { type: String },
  codigoabrev: { type: String },
  precio: { type: Number },
  descuento: { type: Number },
  ancho: { type: Number },
  alto: { type: Number },
  unidad: { type: String },
  mercancia: { type: String },
  acabados: { type: String }
});

const CotizaDetalle = mongoose.model('Schemareccotizadeta', Schemadetacotiza);

// ───────── MODELOS: CATEGORÍA, SUBCATEGORÍA, MARCA, MODELO ─────────
const categoriaSchema = new mongoose.Schema({
  categoria: { type: String, required: true, unique: true, uppercase: true, trim: true },
  descripcion: { type: String, default: "", trim: true },
  fechaCreacion: { type: String, default: () => new Date().toISOString() },
  fechaActualizacion: { type: String, default: () => new Date().toISOString() }
});
const Categoria = mongoose.model('Categoria', categoriaSchema);

const subCategoriaSchema = new mongoose.Schema({
  subCategoria: { type: String, required: true, unique: true, uppercase: true, trim: true },
  categoriaId: { type: String, default: "", trim: true },
  subcategoriaNombre: { type: String, default: "", trim: true },
  descripcion: { type: String, default: "", trim: true },
  fechaCreacion: { type: String, default: () => new Date().toISOString() },
  fechaActualizacion: { type: String, default: () => new Date().toISOString() }
});
const SubCategoria = mongoose.model('SubCategoria', subCategoriaSchema);

const marcaSchema = new mongoose.Schema({
  marca: { type: String, required: true, unique: true, uppercase: true, trim: true },
  descripcion: { type: String, default: "", trim: true },
  paisOrigen: { type: String, default: "", trim: true },
  fechaCreacion: { type: String, default: () => new Date().toISOString() },
  fechaActualizacion: { type: String, default: () => new Date().toISOString() }
});
const Marca = mongoose.model('Marca', marcaSchema);

const modeloSchema = new mongoose.Schema({
  modelo: { type: String, required: true, unique: true, uppercase: true, trim: true },
  marcaId: { type: String, default: "", trim: true },
  marcaNombre: { type: String, default: "", trim: true },
  descripcion: { type: String, default: "", trim: true },
  fechaCreacion: { type: String, default: () => new Date().toISOString() },
  fechaActualizacion: { type: String, default: () => new Date().toISOString() }
});
const Modelo = mongoose.model('Modelo', modeloSchema);


// =========================== MODULOS DE FACTURA Y FACTURA DETALLE ========= //
const facturaSchema = new mongoose.Schema({
   nofactura: { type: String},
    facturaelectronica:{ type:String},
    facturaqr:{ type:String },
    fechafactura:{ type:String },
    fechavencimiento:{ type:String},
    fechainicial:{ type:String },
    fechafinal:{ type:String},
    procesoalquiler:{ type:String},
    fechaEmision:{ type:String},
    fechaSalida:{ type:String},
    duraciondias:{ type :Number},
    retenedor:{ type :String},
    montoretencion: { type : Number},
    codcliente:{type : String},
    idglobalcorporp:{ type : String},
    globalnombre :{ type : String },
    tipoclientefe:{ type : String },
    correocliefe : {type: String },
    naturalezaoperacion : { type : String },
    tipooperacion : {type : String},
    destinooperacion : { type : String },
    formatocafe : { type : String },
    entregacafe : { type : String },
    enviocontenedor : { type : String },
    procesogeneracion : { type : String},
    ruccliente : { type :  String},
    digitoverificadoruc : { type : String},
    codigosucemisor: { type :String},
    tiposucursal: { type : String},
    tipoemision: { type :String},
     tipodocumento: { type :String},
     puntodefacturacion: { type :  String},
    tipoventa: { type :String},
    razonsocial: { type : String},
    direccioncontribuyente: { type : String},
    provincia: { type : String},
    distrito: { type : String},
    corregimiento: { type : String},
    pais: { type :String},
    paisotro: { type :String},
    ubicacionid: { type : String},
    tipoidclientefe: { type : String},
    numeroidextranjero: { type :String},
    telefonowhatsapp: { type :String },
    codigoubicacion: { type :String},
    tipoidentificacion: { type :String},
    identificacionextranjero:{ type : String},
    paisextranjero: { type : String},
    codicionesentrega: { type : String},
    monedaexportacion: { type :String},
    modenaexportanodef: { type :String},
    tipodecambio:{ type :  String},
    monedaextranjera: { type : String},
    fechaemisiondocreferenciado: { type :String},
    cufereferenciado: { type :String},
    nrofacturapapel: { type :String},
    nofacturaimpfiscal: { type : String},
    tipocontribuyente: { type :String},
    codvendedor: { type :String},
    condiciones: { type :String},
    consignacion: { type :String},
    formapago: { type :String},
    descuento: { type : Number},
    subtotal1: { type : Number},
    cotiitbms: { type :String},
    impuesto: { type : Number},
    impuesto1: { type : Number},
    impuesto2: { type : Number},
    impuesto3: { type : Number},
    subtotal2: { type : Number},
    total: { type : Number},
    saldo: { type : Number},
    entregado: { type : Number},
    cambio: { type : Number},
    clasefactura: { type : String},
    nombreclie: { type :String},
    seriefiscal: { type : String},
    detallefactura: { type :String},
    fechadgiauto: { type : String},
    autorizandgi: { type : String},
    imagen:{ type : String},
    centrocosto: { type :String},
    historialnotacredito : [String],
    historialnotacambio: [String],
    historialnotadebito: [String],
    clasecliente: { type : String},
    estado: { type : String },
    fechaCreacion: { type : String},
    fechaActualizacion: { type : String}
}) 
const FacturaHead = mongoose.model('FacturaHead', facturaSchema);


const facturadetalleSchema = new mongoose.Schema({
    nofactura: { type :String},
    fechafactura: { type :String},
    codcliente: { type :String},
    codvendedor: { type : String},
    codproducto: { type : String},
    cantidad: { type :Number},
    descripcion: { type : String},
    precio: { type : Number},
    descuento: { type : Number},
    impuesto1: { type : Number},
    impuesto2: { type : Number},
    impuesto3: { type : Number},
    codtasaisc: { type :String},
    tasaisc: { type : Number},
    ancho: { type : Number},
    alto: { type : Number},
    numerolote: { type :String},
    cantiprodlote: { type : Number},
    unidad: { type :String},
    mercancia: { type : String},
    modelo: { type : String},
    fechafabricacion: { type :String} ,
    fechaexpiracion: { type : String},
    codigobienes: { type : String},
    codigoabrev: { type : String},
    codigogtin: { type : Number},
    codigogtininven: { type : Number},
    cantigtin: { type : Number},
    tasaitbmscod: { type : Number},
    valorisc: { type : Number },
    tasaoti: { type : Number},
    valortasaotro: { type : Number},
    hora: { type :String},
    acabados: {  type : String},
    pormayor: { type : Number},
    detventa: { type : Number },
    especificaciones: { type :String},
    subtotal: { type : Number}
}) 

const FacturaDetalle = mongoose.model('FacturaDetalle', facturadetalleSchema);
    // ✅ Helper para calcular subtotal de línea
  
// ============================================================================
// 🔹 RUTAS: DASHBOARD
// ============================================================================
// ============================================================================
// 🔹 RUTAS: DASHBOARD (CON DATOS REALES DE CotizaHead Y FacturaHead)
// ============================================================================
app.get("/api/dashboard", async (req, res) => {
  try {
    // ═══════════════════════════════════════════════════════
    // 🔹 1. CALCULAR DATOS REALES DE COTIZACIONES
    // ═══════════════════════════════════════════════════════
    const todasCotizaciones = await CotizaHead.find({ activo: { $ne: "N" } });
    const cotizacionesTotal = todasCotizaciones.length;

    // Contar cotizaciones convertidas (coticonvertido = "S" o "SI")
    const cotizacionesConvertidasArr = todasCotizaciones.filter(c =>
      c.coticonvertido === 'S' 
    );
    const cotizacionesConvertidas = cotizacionesConvertidasArr.length;
    const cotizacionesNoConvertidas = cotizacionesTotal - cotizacionesConvertidas;

    // Calcular porcentaje de conversión
    let porcentajeConversion = 0;
    if (cotizacionesTotal > 0) {
      porcentajeConversion = (cotizacionesConvertidas / cotizacionesTotal) * 100;
    }

    // Calcular totales monetarios
    const totalCotizado = todasCotizaciones.reduce((sum, c) => sum + (c.total || 0), 0);
    const totalConvertido = cotizacionesConvertidasArr.reduce((sum, c) => sum + (c.total || 0), 0);

    // ═══════════════════════════════════════════════════════
    // 🔹 2. CALCULAR DATOS REALES DE FACTURAS (VENTAS)
    // ═══════════════════════════════════════════════════════
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (date) => date.toISOString().split('T')[0];
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);
    const currentMonthStr = todayStr.substring(0, 7); // "YYYY-MM"

    // Consultar facturas por fecha (excluir anuladas)
    const facturasHoy = await FacturaHead.find({
      fechafactura: todayStr,
      estado: { $ne: 'A' }
    });

    const facturasAyer = await FacturaHead.find({
      fechafactura: yesterdayStr,
      estado: { $ne: 'A' }
    });

    const facturasMes = await FacturaHead.find({
      fechafactura: { $regex: `^${currentMonthStr}` },
      estado: { $ne: 'A' }
    });

    // Calcular totales de ventas
    const ventasHoy = facturasHoy.reduce((sum, f) => sum + (f.total || 0), 0);
    const ventasAyer = facturasAyer.reduce((sum, f) => sum + (f.total || 0), 0);
    const ventasMes = facturasMes.reduce((sum, f) => sum + (f.total || 0), 0);

    const countFacturasHoy = facturasHoy.length;
    const countFacturasAyer = facturasAyer.length;

    // Calcular crecimiento porcentual
    let crecimiento = 0;
    if (ventasAyer > 0) {
      crecimiento = ((ventasHoy - ventasAyer) / ventasAyer) * 100;
    }

    // ═══════════════════════════════════════════════════════
    // 🔹 3. VERIFICAR SI HAY DATOS REALES
    // ═══════════════════════════════════════════════════════
    const hasRealData = (cotizacionesTotal > 0 || facturasHoy.length > 0 || facturasMes.length > 0);

    // ═══════════════════════════════════════════════════════
    // 🔹 4. PREPARAR DATOS FINALES (reales o fallback)
    // ═══════════════════════════════════════════════════════
    const finalData = hasRealData ? {
      ventasHoy: parseFloat(ventasHoy.toFixed(2)),
      facturasHoy: countFacturasHoy,
      ventasAyer: parseFloat(ventasAyer.toFixed(2)),
      facturasAyer: countFacturasAyer,
      ventasMes: parseFloat(ventasMes.toFixed(2)),
      crecimiento: parseFloat(crecimiento.toFixed(2)),
      cotizacionesTotal,
      cotizacionesConvertidas,
      cotizacionesNoConvertidas,
      porcentajeConversion: parseFloat(porcentajeConversion.toFixed(2)),
      totalCotizado: parseFloat(totalCotizado.toFixed(2)),
      totalConvertido: parseFloat(totalConvertido.toFixed(2))
    } : {
      // Valores fijos de respaldo si la BD está vacía
      ventasHoy: 0, facturasHoy: 0,
      ventasAyer: 0, facturasAyer: 0,
      ventasMes: 0, crecimiento: 0,
      cotizacionesTotal: 0,
      cotizacionesConvertidas: 0,
      cotizacionesNoConvertidas: 0,
      porcentajeConversion: 0,
      totalCotizado: 0,
      totalConvertido: 0
    };

    // ═══════════════════════════════════════════════════════
    // 🔹 5. ACTUALIZAR O CREAR REGISTRO EN DASHBOARD
    // ═══════════════════════════════════════════════════════
    let data = await Dashboard.findOne();
    if (!data) {
      data = await Dashboard.create({
        ...finalData,
        lastUpdated: new Date().toISOString()
      });
    } else {
      Object.assign(data, finalData);
      data.lastUpdated = new Date().toISOString();
      await data.save();
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Error /api/dashboard:", err);
    res.status(500).json({ message: "Error interno", error: err.message });
  }
});

// ============================================================================
// 🔹 RUTAS: EMPRESA CONFIG
// ============================================================================
app.get("/api/empresa", async (req, res) => {
  try {
    const data = await EmpresaConfig.findOne();
    if (!data) return res.status(404).json({ success: false, message: "No hay configuración de empresa registrada" });
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Error GET /api/empresa:", err);
    res.status(500).json({ success: false, message: "Error interno del servidor", error: err.message });
  }
});

app.post("/api/empresa", async (req, res) => {
  try {
    const { rucempresa, empresa } = req.body;
    if (!rucempresa?.trim() || !empresa?.trim()) {
      return res.status(400).json({ success: false, message: "RUC y Nombre de Empresa son campos obligatorios" });
    }
    const existing = await EmpresaConfig.findOne();
    if (existing) {
      return res.status(409).json({ success: false, message: "Ya existe una configuración registrada. Use PUT para actualizar", existingId: existing._id });
    }
    const newConfig = await EmpresaConfig.create(req.body);
    res.status(201).json({ success: true, message: "✅ Configuración de empresa creada exitosamente", data: newConfig });
  } catch (err) {
    console.error("❌ Error POST /api/empresa:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "❌ El RUC ingresado ya está registrado en el sistema" });
    }
    res.status(500).json({ success: false, message: "Error al crear configuración", error: err.message });
  }
});

app.put("/api/empresa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.rucempresa;
    delete updateData._id;
    delete updateData.createdAt;
    const updated = await EmpresaConfig.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, context: 'query' });
    if (!updated) return res.status(404).json({ success: false, message: "Configuración no encontrada" });
    res.json({ success: true, message: "✅ Configuración actualizada exitosamente", data: updated });
  } catch (err) {
    console.error("❌ Error PUT /api/empresa:", err);
    res.status(500).json({ success: false, message: "Error al actualizar configuración", error: err.message });
  }
});

app.delete("/api/empresa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID de configuración inválido" });
    }
    const deleted = await EmpresaConfig.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Configuración no encontrada" });
    res.json({ success: true, message: "🗑️ Configuración eliminada exitosamente" });
  } catch (err) {
    console.error("❌ Error DELETE /api/empresa:", err);
    res.status(500).json({ success: false, message: "Error al eliminar configuración", error: err.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor ERP Bipymes funcionando", timestamp: new Date().toISOString() });
});

// ============================================================================
// 🔹 RUTAS: ADICIONALES
// ============================================================================
app.get('/api/adicionales', async (req, res) => {
  try {
    const adicional = await Adicional.findOne();
    if (!adicional) return res.status(404).json({ success: false, message: 'No hay configuración adicional registrada' });
    res.json({ success: true, message: 'Configuración adicional obtenida', data: adicional });
  } catch (error) {
    console.error('❌ Error GET /api/adicionales:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.post('/api/adicionales', async (req, res) => {
  try {
    const existing = await Adicional.findOne();
    if (existing) return res.status(409).json({ success: false, message: 'Ya existe una configuración adicional' });
    const nuevoAdicional = new Adicional(req.body);
    const guardado = await nuevoAdicional.save();
    res.status(201).json({ success: true, message: 'Configuración adicional creada', data: guardado });
  } catch (error) {
    console.error('❌ Error POST /api/adicionales:', error);
    res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
  }
});

app.put('/api/adicionales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    const actualizado = await Adicional.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Configuración adicional no encontrada' });
    res.json({ success: true, message: 'Configuración adicional actualizada', data: actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/adicionales:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});

app.delete('/api/adicionales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Adicional.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ success: false, message: 'Configuración adicional no encontrada' });
    res.json({ success: true, message: 'Configuración adicional eliminada' });
  } catch (error) {
    console.error('❌ Error DELETE /api/adicionales:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
  }
});

// ============================================================================
// 🔹 RUTAS: BIENES Y SERVICIOS
// ============================================================================
app.get('/api/bienes', async (req, res) => {
  try {
    const bienes = await BienServicio.find().sort({ createdAt: -1 });
    res.json({ success: true, message: 'Bienes obtenidos', data: bienes });
  } catch (error) {
    console.error('❌ Error GET /api/bienes:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.get('/api/bienes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bien = await BienServicio.findById(id);
    if (!bien) return res.status(404).json({ success: false, message: 'Bien no encontrado' });
    res.json({ success: true, message: 'Bien obtenido', data: bien });
  } catch (error) {
    console.error('❌ Error GET /api/bienes/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.post('/api/bienes', async (req, res) => {
  try {
    const { codigobienes, descripbienes } = req.body;
    const existing = await BienServicio.findOne({ codigobienes });
    if (existing) return res.status(409).json({ success: false, message: 'Ya existe un bien con este código' });
    const nuevoBien = new BienServicio({ codigobienes, descripbienes });
    const guardado = await nuevoBien.save();
    res.status(201).json({ success: true, message: 'Bien creado', data: guardado });
  } catch (error) {
    console.error('❌ Error POST /api/bienes:', error);
    res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
  }
});

app.put('/api/bienes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descripbienes } = req.body;
    const actualizado = await BienServicio.findByIdAndUpdate(id, { descripbienes }, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Bien no encontrado' });
    res.json({ success: true, message: 'Bien actualizado', data: actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/bienes:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});

app.delete('/api/bienes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await BienServicio.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ success: false, message: 'Bien no encontrado' });
    res.json({ success: true, message: 'Bien eliminado' });
  } catch (error) {
    console.error('❌ Error DELETE /api/bienes:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
  }
});

app.post('/api/bienes/bulk', async (req, res) => {
    try {
        const bienesArray = req.body;
        if (!Array.isArray(bienesArray)) {
            return res.status(400).json({ success: false, message: 'Se requiere un array de bienes' });
        }

        // ✅ 1. Obtener códigos existentes UNA SOLA VEZ
        const existingBienes = await BienServicio.find({}, 'codigobienes');
        const existingCodes = new Set(existingBienes.map(b => b.codigobienes));

        // ✅ 2. Filtrar y preparar los documentos válidos
        const documentosValidos = [];
        let duplicateCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const bienData of bienesArray) {
            try {
                const { codigobienes, descripbienes } = bienData;
                
                // Validar campos obligatorios
                if (!codigobienes || !descripbienes) {
                    errorCount++;
                    errors.push('Registro sin codigobienes o descripbienes');
                    continue;
                }

                // Verificar duplicados
                if (existingCodes.has(codigobienes)) {
                    duplicateCount++;
                    continue;
                }

                // Agregar al array de documentos válidos
                documentosValidos.push({
                    codigobienes: codigobienes,
                    descripbienes: descripbienes
                });

                // Marcar como existente para evitar duplicados dentro del mismo lote
                existingCodes.add(codigobienes);
            } catch (err) {
                errorCount++;
                errors.push(`Error: ${err.message}`);
            }
        }

        // ✅ 3. INSERTAR TODOS DE UNA VEZ con insertMany (MUCHO MÁS RÁPIDO)
        let successCount = 0;
        if (documentosValidos.length > 0) {
            try {
                const result = await BienServicio.insertMany(documentosValidos, { 
                    ordered: false,  // ✅ Continúa insertando aunque haya errores
                    rawResult: true 
                });
                successCount = result.insertedCount || documentosValidos.length;
            } catch (err) {
                // Si hay errores parciales, contar los exitosos
                if (err.insertedDocs && err.insertedDocs.length > 0) {
                    successCount = err.insertedDocs.length;
                }
                console.error('⚠️ Errores parciales en insertMany:', err.message);
                errors.push(`Errores parciales: ${err.message}`);
            }
        }

        // ✅ 4. Responder con el resumen
        res.json({
            success: true,
            message: 'Carga masiva completada',
            data: {
                total: bienesArray.length,
                success: successCount,
                duplicates: duplicateCount,
                errors: errorCount,
                errorMessages: errors.slice(0, 10)  // Limitar a 10 errores para no saturar
            }
        });

    } catch (error) {
        console.error('❌ Error POST /api/bienes/bulk:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en carga masiva', 
            error: error.message 
        });
    }
});

app.post('/api/ubicaciones/bulk', async (req, res) => {
    try {
        const ubicacionesArray = req.body;
        if (!Array.isArray(ubicacionesArray)) {
            return res.status(400).json({ success: false, message: 'Se requiere un array de ubicaciones' });
        }

        // ✅ 1. Obtener IDs existentes UNA SOLA VEZ
        const existingUbicaciones = await Ubicacion.find({}, 'ubicacionid');
        const existingIds = new Set(existingUbicaciones.map(u => u.ubicacionid));

        // ✅ 2. Filtrar y preparar los documentos válidos
        const documentosValidos = [];
        let duplicateCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const ubicacionData of ubicacionesArray) {
            try {
                const { ubicacionid, descripubicacion } = ubicacionData;
                
                // Validar campos obligatorios
                if (!ubicacionid || !descripubicacion) {
                    errorCount++;
                    errors.push('Registro sin ubicacionid o descripubicacion');
                    continue;
                }

                // Verificar duplicados
                if (existingIds.has(ubicacionid)) {
                    duplicateCount++;
                    continue;
                }

                // Agregar al array de documentos válidos
                documentosValidos.push({
                    ubicacionid: ubicacionid,
                    descripubicacion: descripubicacion
                });

                // Marcar como existente para evitar duplicados dentro del mismo lote
                existingIds.add(ubicacionid);
            } catch (err) {
                errorCount++;
                errors.push(`Error: ${err.message}`);
            }
        }

        // ✅ 3. INSERTAR TODOS DE UNA VEZ con insertMany (MUCHO MÁS RÁPIDO)
        let successCount = 0;
        if (documentosValidos.length > 0) {
            try {
                const result = await Ubicacion.insertMany(documentosValidos, { 
                    ordered: false,  // ✅ Continúa insertando aunque haya errores
                    rawResult: true 
                });
                successCount = result.insertedCount || documentosValidos.length;
            } catch (err) {
                // Si hay errores parciales, contar los exitosos
                if (err.insertedDocs && err.insertedDocs.length > 0) {
                    successCount = err.insertedDocs.length;
                }
                console.error('⚠️ Errores parciales en insertMany:', err.message);
                errors.push(`Errores parciales: ${err.message}`);
            }
        }

        // ✅ 4. Responder con el resumen
        res.json({
            success: true,
            message: 'Carga masiva completada',
            total: ubicacionesArray.length,
            success: successCount,
            duplicates: duplicateCount,
            errors: errorCount,
            errorMessages: errors.slice(0, 10)  // Limitar a 10 errores para no saturar
        });

    } catch (error) {
        console.error('❌ Error POST /api/ubicaciones/bulk:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en carga masiva', 
            error: error.message 
        });
    }
});

// ============================================================================
// 🔹 RUTAS: UBICACIONES
// ============================================================================
app.get('/api/ubicaciones', async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find().sort({ ubicacionid: 1, descripubicacion : 1 });
    res.json({ success: true, message: 'Ubicaciones obtenidas', ubicaciones });
  } catch (error) {
    console.error('❌ Error GET /api/ubicaciones:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.get('/api/ubicaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ubicacion = await Ubicacion.findById(id);
    if (!ubicacion) return res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
    res.json({ success: true, message: 'Ubicación obtenida', ubicacion });
  } catch (error) {
    console.error('❌ Error GET /api/ubicaciones/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.post('/api/ubicaciones', async (req, res) => {
  try {
    const { ubicacionid, descripubicacion } = req.body;
    if (!ubicacionid || !descripubicacion) {
      return res.status(400).json({ success: false, message: 'ID, provincia, distrito y corregimiento son obligatorios' });
    }
    const existing = await Ubicacion.findOne({ numcontrol });
    if (existing) return res.status(409).json({ success: false, message: 'Ya existe una ubicación con este ID' });
    var numcontrol = Math.floor(Math.random() * 10000000);
    const nuevaUbicacion = new Ubicacion({ ubicacionid, descripubicacion });
    const guardado = await nuevaUbicacion.save();
    res.status(201).json({ success: true, message: 'Ubicación creada', guardado });
  } catch (error) {
    console.error('❌ Error POST /api/ubicaciones:', error);
    res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
  }
});

app.put('/api/ubicaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.ubicacionid;
    delete updateData._id;
    const actualizado = await Ubicacion.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
    res.json({ success: true, message: 'Ubicación actualizada', actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/ubicaciones:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});

app.delete('/api/ubicaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;

 const eliminado = await Ubicacion.findByIdAndDelete(id); 
    if (!eliminado) return res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
    res.json({ success: true, message: 'Ubicación eliminada' });
  } catch (error) {
    console.error('❌ Error DELETE /api/ubicaciones:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
  }
});


// ───────── CATEGORÍAS ─────────
app.get('/api/inventarios/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.find({}).sort({ categoria: 1 });
    res.json({ success: true, message: `${categorias.length} categoría(s) encontrada(s)`, data: categorias });
  } catch (error) {
    console.error('❌ Error GET /api/inventarios/categorias:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.post('/api/inventarios/categorias', async (req, res) => {
  try {
    const { categoria, descripcion } = req.body;
    var fechasistema = formatLocalYmd(new Date());
    if (!categoria?.trim()) return res.status(400).json({ success: false, message: 'El nombre de la categoría es obligatorio' });
    const existing = await Categoria.findOne({ categoria: categoria.trim().toUpperCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Ya existe una categoría con este nombre' });
    const nuevaCategoria = new Categoria({
      categoria: categoria.trim().toUpperCase(),
      descripcion: descripcion?.trim() || '',
      fechaCreacion: fechasistema,
      fechaActualizacion: fechasistema
    });
    const guardado = await nuevaCategoria.save();
    res.status(201).json({ success: true, message: '✅ Categoría creada exitosamente', data: guardado });
  } catch (error) {
    console.error('❌ Error POST /api/inventarios/categorias:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'La categoría ya existe' });
    res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
  }
});

// ───────── SUBCATEGORÍAS ─────────
app.get('/api/inventarios/subcategorias', async (req, res) => {
  try {
    const subcategorias = await SubCategoria.find({}).sort({ subCategoria: 1 });
    res.json({ success: true, message: `${subcategorias.length} subcategoría(s) encontrada(s)`, data: subcategorias });
  } catch (error) {
    console.error('❌ Error GET /api/inventarios/subcategorias:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.post('/api/inventarios/subcategorias', async (req, res) => {
  try {
    const { subCategoria, categoriaId, descripcion } = req.body;
    var fechasistema = formatLocalYmd(new Date());
    if (!subCategoria?.trim()) return res.status(400).json({ success: false, message: 'El nombre de la subcategoría es obligatorio' });
    const existing = await SubCategoria.findOne({ subCategoria: subCategoria.trim().toUpperCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Ya existe una subcategoría con este nombre' });
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
      fechaCreacion: fechasistema,
      fechaActualizacion: fechasistema
    });
    const guardado = await nuevaSubCategoria.save();
    res.status(201).json({ success: true, message: '✅ Subcategoría creada exitosamente', data: guardado });
  } catch (error) {
    console.error('❌ Error POST /api/inventarios/subcategorias:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'La subcategoría ya existe' });
    res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
  }
});

// ───────── MARCAS ─────────
app.get('/api/inventarios/marcas', async (req, res) => {
  try {
    const marcas = await Marca.find({}).sort({ marca: 1 });
    res.json({ success: true, message: `${marcas.length} marca(s) encontrada(s)`, data: marcas });
  } catch (error) {
    console.error('❌ Error GET /api/inventarios/marcas:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.post('/api/inventarios/marcas', async (req, res) => {
  try {
    const { marca, descripcion, paisOrigen } = req.body;
    var fechasistema = formatLocalYmd(new Date());
    if (!marca?.trim()) return res.status(400).json({ success: false, message: 'El nombre de la marca es obligatorio' });
    const existing = await Marca.findOne({ marca: marca.trim().toUpperCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Ya existe una marca con este nombre' });
    const nuevaMarca = new Marca({
      marca: marca.trim().toUpperCase(),
      descripcion: descripcion?.trim() || '',
      paisOrigen: paisOrigen?.trim() || '',
      fechaCreacion: fechasistema,
      fechaActualizacion: fechasistema
    });
    const guardado = await nuevaMarca.save();
    res.status(201).json({ success: true, message: '✅ Marca creada exitosamente', data: guardado });
  } catch (error) {
    console.error('❌ Error POST /api/inventarios/marcas:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'La marca ya existe' });
    res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
  }
});

// ───────── MODELOS ─────────
app.get('/api/inventarios/modelos', async (req, res) => {
  try {
    const modelos = await Modelo.find({}).sort({ modelo: 1 });
    res.json({ success: true, message: `${modelos.length} modelo(s) encontrado(s)`, data: modelos });
  } catch (error) {
    console.error('❌ Error GET /api/inventarios/modelos:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.post('/api/inventarios/modelos', async (req, res) => {
  try {
    const { modelo, marcaId, descripcion } = req.body;
    if (!modelo?.trim()) return res.status(400).json({ success: false, message: 'El nombre del modelo es obligatorio' });
    const existing = await Modelo.findOne({ modelo: modelo.trim().toUpperCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Ya existe un modelo con este nombre' });
    let marcaNombre = '';
    if (marcaId) {
      const marca = await Marca.findById(marcaId);
      if (marca) marcaNombre = marca.marca;
    }
    var fechasistema = formatLocalYmd(new Date());
    const nuevoModelo = new Modelo({
      modelo: modelo.trim().toUpperCase(),
      marcaId: marcaId?.trim() || '',
      marcaNombre: marcaNombre,
      descripcion: descripcion?.trim() || '',
      fechaCreacion: fechasistema,
      fechaActualizacion: fechasistema
    });
    const guardado = await nuevoModelo.save();
    res.status(201).json({ success: true, message: '✅ Modelo creado exitosamente', data: guardado });
  } catch (error) {
    console.error('❌ Error POST /api/inventarios/modelos:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'El modelo ya existe' });
    res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
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
    if (!Array.isArray(inventariosArray)) return res.status(400).json({ success: false, message: 'Se requiere un array de inventarios' });
    let successCount = 0, duplicateCount = 0, errorCount = 0;
    const errors = [];
    for (const invData of inventariosArray) {
      try {
        const { idinventario, inventarionombre } = invData;
        if (!idinventario || !inventarionombre) { errorCount++; continue; }
        const existing = await Inventariosede.findOne({ idinventario });
        if (existing) { duplicateCount++; continue; }
        const nuevoInv = new Inventariosede(invData);
        await nuevoInv.save();
        successCount++;
      } catch (err) { errorCount++; errors.push(`Error en ${invData.idinventario}: ${err.message}`); }
    }
    res.json({
      success: true, message: 'Carga masiva de inventario completada',
      data: { total: inventariosArray.length, success: successCount, duplicates: duplicateCount, errors: errorCount, errorMessages: errors }
    });
  } catch (error) {
    console.error('❌ Error POST /api/inventarios/bulk:', error);
    res.status(500).json({ success: false, message: 'Error en carga masiva', error: error.message });
  }
});


//================================================================//
// ───────── VENDEDOR  ─────────
app.get('/api/vendedor', async (req, res) => {
  try {
    const vendedor = await Vendedor.find({}).sort({ vendedorNombre: 1 });
    res.json({ success: true, message: `${vendedor.length} vendedores(s) encontrada(s)`, data: vendedor });
  } catch (error) {
    console.error('❌ Error GET /api/vendedor:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.post('/api/vendedor', async (req, res) => {
  try {
    const { idvendedor, vendenombre, tipovendedor, dir1vende, dir2vende,telvende,emailvende } = req.body;
    if (!idvendedor?.trim()) return res.status(400).json({ success: false, message: 'El codigo de vendedor es obligatorio' });
    const existing = await Vendedor.findOne({ idvendedor: idvendedor.trim().toUpperCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Ya existe ese codigo ' });
    const nuevoVendedor = new Vendedor({
      idvendedor: idvendedor.trim().toUpperCase(),
      vendenombre: vendenombre?.trim() || '',
      tipovendedor: tipovendedor?.trim() || '',
      dir1vende: dir1vende?.trim() || '',
      dir2vende: dir2vende?.trim() || '',
      telvende: telvende?.trim() || '',
      emailvende: emailvende?.trim() || '',
       ventasvende :  0
    });
    const guardado = await nuevoVendedor.save();
    res.status(201).json({ success: true, message: '✅ Vendedor creado exitosamente', data: guardado });
  } catch (error) {
    console.error('❌ Error POST /api/vendedor:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'La marca ya existe' });
    res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
  }
});
//================================================================//

// ═══════════════════════════════════════════════════════════════
// 2️⃣ DESPUÉS: RUTAS CON ID ESPECÍFICO
// ═══════════════════════════════════════════════════════════════

// ───────── CATEGORÍAS CON ID ─────────
app.get('/api/inventarios/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const categoria = await Categoria.findById(id);
    if (!categoria) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    res.json({ success: true, message: 'Categoría obtenida', data: categoria });
  } catch (error) {
    console.error('❌ Error GET /api/inventarios/categorias/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.put('/api/inventarios/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const updateData = { ...req.body };
    delete updateData._id; delete updateData.fechaCreacion;
    if (updateData.categoria) updateData.categoria = updateData.categoria.trim().toUpperCase();
    updateData.fechaActualizacion = new Date().toISOString();
    const actualizado = await Categoria.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    res.json({ success: true, message: '✅ Categoría actualizada', data: actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/inventarios/categorias/:id:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe una categoría con este nombre' });
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});

app.delete('/api/inventarios/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
 
    const eliminado = await Categoria.findByIdAndDelete(id); 
    if (!eliminado) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
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
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const subcategoria = await SubCategoria.findById(id);
    if (!subcategoria) return res.status(404).json({ success: false, message: 'Subcategoría no encontrada' });
    res.json({ success: true, message: 'Subcategoría obtenida', data: subcategoria });
  } catch (error) {
    console.error('❌ Error GET /api/inventarios/subcategorias/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.put('/api/inventarios/subcategorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const updateData = { ...req.body };
    delete updateData._id; delete updateData.fechaCreacion;
    if (updateData.subCategoria) updateData.subCategoria = updateData.subCategoria.trim().toUpperCase();
    updateData.fechaActualizacion = new Date().toISOString();
    const actualizado = await SubCategoria.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Subcategoría no encontrada' });
    res.json({ success: true, message: '✅ Subcategoría actualizada', data: actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/inventarios/subcategorias/:id:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe una subcategoría con este nombre' });
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});

app.delete('/api/inventarios/subcategorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
   
   const eliminado = await SubCategoria.findByIdAndDelete(id); 
    if (!eliminado) return res.status(404).json({ success: false, message: 'Subcategoría no encontrada' });
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
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const marca = await Marca.findById(id);
    if (!marca) return res.status(404).json({ success: false, message: 'Marca no encontrada' });
    res.json({ success: true, message: 'Marca obtenida', data: marca });
  } catch (error) {
    console.error('❌ Error GET /api/inventarios/marcas/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.put('/api/inventarios/marcas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const updateData = { ...req.body };
    delete updateData._id; delete updateData.fechaCreacion;
    if (updateData.marca) updateData.marca = updateData.marca.trim().toUpperCase();
    updateData.fechaActualizacion = new Date().toISOString();
    const actualizado = await Marca.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Marca no encontrada' });
    res.json({ success: true, message: '✅ Marca actualizada', data: actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/inventarios/marcas/:id:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe una marca con este nombre' });
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});

app.delete('/api/inventarios/marcas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
   
  const eliminado = await Marca.findByIdAndDelete(id); 
    if (!eliminado) return res.status(404).json({ success: false, message: 'Marca no encontrada' });
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
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const modelo = await Modelo.findById(id);
    if (!modelo) return res.status(404).json({ success: false, message: 'Modelo no encontrado' });
    res.json({ success: true, message: 'Modelo obtenido', data: modelo });
  } catch (error) {
    console.error('❌ Error GET /api/inventarios/modelos/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.put('/api/inventarios/modelos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    var fechasistema = formatLocalYmd(new Date());
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const updateData = { ...req.body };
    delete updateData._id; delete updateData.fechaCreacion;
    if (updateData.modelo) updateData.modelo = updateData.modelo.trim().toUpperCase();
    updateData.fechaActualizacion = fechasistema;
    const actualizado = await Modelo.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Modelo no encontrado' });
    res.json({ success: true, message: '✅ Modelo actualizado', data: actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/inventarios/modelos/:id:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe un modelo con este nombre' });
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});

app.delete('/api/inventarios/modelos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
   
     const eliminado = await Modelo.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ success: false, message: 'Modelo no encontrado' });
    res.json({ success: true, message: '🗑️ Modelo eliminado (desactivado)' });
  } catch (error) {
    console.error('❌ Error DELETE /api/inventarios/modelos/:id:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
  }
});

// ===============================================================
// ───────── VENDEDOR  CON ID ─────────
app.get('/api/vendedor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const vendedor = await Vendedor.findById(id);
    if (!vendedor) return res.status(404).json({ success: false, message: 'Vendedor no encontrado' });
    res.json({ success: true, message: 'Vendedor obtenido', data: marca });
  } catch (error) {
    console.error('❌ Error GET /api/vendedor/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});


app.put('/api/vendedor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const updateData = { ...req.body };
    delete updateData._id; 
    if (updateData.idvendedor)
       updateData.vendenombre = updateData.vendenombre.trim().toUpperCase();
       updateData.tipovendedor = updateData.tipovendedor.trim().toUpperCase();
       updateData.dir1vende = updateData.dir1vende.trim().toUpperCase();
       updateData.dir2vende = updateData.dir2vende.trim().toUpperCase();
       updateData.telvende = updateData.telvende.trim().toUpperCase();
       updateData.emailvende = updateData.emailvende.trim().toUpperCase();
// 
    const actualizado = await Vendedor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Vendedor no encontrado' });
    res.json({ success: true, message: '✅ Vendedor actualizada', data: actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/vendedor/:id:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe vendedor' });
    res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
  }
});   


app.delete('/api/vendedor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validación del formato del ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }
    
    // 🔥 CORREGIDO: Remueve físicamente el registro de la colección en la base de datos
    const eliminado = await Vendedor.findByIdAndDelete(id);
    
    if (!eliminado) {
      return res.status(404).json({ success: false, message: 'Vendedor no encontrado' });
    }
    
    res.json({ success: true, message: '🗑️ Vendedor eliminado permanentemente de la base de datos' });
  } catch (error) {
    console.error('❌ Error DELETE /api/vendedor/:id:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
  }
});
//  ==============================================================

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
    if (existing) return res.status(409).json({ success: false, message: "Ya existe un producto con este ID de inventario" });
    const nuevoInventario = new Inventariosede(req.body);
    const guardado = await nuevoInventario.save();
    res.status(201).json({ success: true, message: "✅ Producto de inventario creado exitosamente", data: guardado });
  } catch (err) {
    console.error("❌ Error POST /api/inventarios:", err);
    if (err.code === 11000) return res.status(409).json({ success: false, message: "❌ El ID de inventario ya está registrado" });
    res.status(500).json({ success: false, message: "Error al crear inventario", error: err.message });
  }
});

// ⚠️ ESTA RUTA DEBE IR AL FINAL DE TODAS LAS RUTAS DE INVENTARIOS
app.get('/api/inventarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const inventario = await Inventariosede.findById(id);
    if (!inventario) return res.status(404).json({ success: false, message: 'Inventario no encontrado' });
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
    delete updateData.idinventario; delete updateData._id; delete updateData.createdAt;
    const actualizado = await Inventariosede.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, context: 'query' });
    if (!actualizado) return res.status(404).json({ success: false, message: "Inventario no encontrado" });
    res.json({ success: true, message: "✅ Inventario actualizado exitosamente", data: actualizado });
  } catch (err) {
    console.error("❌ Error PUT /api/inventarios:", err);
    res.status(500).json({ success: false, message: "Error al actualizar inventario", error: err.message });
  }
});

app.delete('/api/inventarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "ID de inventario inválido" });
    const eliminado = await Inventariosede.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ success: false, message: "Inventario no encontrado" });
    res.json({ success: true, message: "🗑️ Producto eliminado exitosamente del inventario" });
  } catch (err) {
    console.error("❌ Error DELETE /api/inventarios:", err);
    res.status(500).json({ success: false, message: "Error al eliminar inventario", error: err.message });
  }
});

// ============================================================================
// 🔹 RUTAS: CLIENTES
// ============================================================================
app.get('/api/ventas/clientes', async (req, res) => {

 try {
    const cliente = await Cliente.find({}).sort({ createdAt: -1 });
    res.json({ success: true, message: 'Clientes obtenidos', data: cliente });
  } catch (error) {
    console.error('❌ Error GET /api/clientes:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }

});

app.post('/api/ventas/clientes', async (req, res) => {
  try {
    const { idcliente, clientenombre } = req.body;
   if (!idcliente?.trim() || !clientenombre?.trim()) {
      return res.status(400).json({ success: false, message: 'ID Cliente y Nombre son campos obligatorios' });
    }
    const existing = await Cliente.findOne({ idcliente });
    if (existing) return res.status(409).json({ success: false, message: "Ya existe un cliente con este Codigo" });
    const nuevoCliente = new Cliente(req.body);
    const guardado = await nuevoCliente.save();
    res.status(201).json({ success: true, message: "✅ Cliente creado exitosamente", data: guardado });
  } catch (err) {
    console.error("❌ Error POST /api/ventas/clientes:", err);
    if (err.code === 11000) return res.status(409).json({ success: false, message: "❌ El codigo de cliente ya está registrado" });
    res.status(500).json({ success: false, message: "Error al crear Cliente en server endpoint ", error: err.message });
  }
});

app.get('/api/ventas/clientes/search', async (req, res) => {
  try {
    const { query, clientenombre, ruccliente, ciudadcliente, vendedorcliente } = req.query;
    let filters = {};
    if (query?.trim()) {
      const regex = new RegExp(query.trim(), 'i');
      filters.$or = [
        { clientenombre: { $regex: regex } }, { ruccliente: { $regex: regex } },
        { ciudadcliente: { $regex: regex } }, { telcliente: { $regex: regex } },
        { emailcliente: { $regex: regex } }
      ];
    }
    if (clientenombre?.trim()) filters.clientenombre = { $regex: clientenombre.trim(), $options: 'i' };
    if (ruccliente?.trim()) filters.ruccliente = ruccliente.trim().toUpperCase();
    if (ciudadcliente?.trim()) filters.ciudadcliente = { $regex: ciudadcliente.trim(), $options: 'i' };
    if (vendedorcliente?.trim()) filters.vendedorcliente = vendedorcliente.trim().toUpperCase();
    const clientes = await Cliente.find(filters).sort({ clientenombre: 1 }).limit(100);
    res.json({ success: true, message: `${clientes.length} resultado(s) para la búsqueda`, data: clientes });
  } catch (error) {
    console.error('❌ Error GET /api/ventas/clientes/search:', error);
    res.status(500).json({ success: false, message: 'Error en búsqueda', error: error.message });
  }
});

app.post('/api/ventas/clientes/bulk', async (req, res) => {
  try {
    const clientesArray = req.body;
    if (!Array.isArray(clientesArray) || clientesArray.length === 0) {
      return res.status(400).json({ success: false, message: 'Se requiere un array de clientes para carga masiva' });
    }
    if (clientesArray.length > BULK_LIMIT) {
      return res.status(400).json({ success: false, message: `Máximo ${BULK_LIMIT} registros por carga` });
    }
    let successCount = 0, duplicateCount = 0, errorCount = 0;
    const errors = [];
    const existingIds = new Set((await Cliente.find({}, 'idcliente')).map(c => c.idcliente?.toUpperCase()));
    for (const clienteData of clientesArray) {
      try {
        const { idcliente, clientenombre } = clienteData;
        var fechasistema = formatLocalYmd(new Date());
        if (!idcliente?.trim() || !clientenombre?.trim()) { errorCount++; continue; }
        const idNormalizado = idcliente.trim().toUpperCase();
        if (existingIds.has(idNormalizado)) { duplicateCount++; continue; }
        const nuevoCliente = new Cliente({
          ...clienteData,
          idcliente: idNormalizado,
          clientenombre: clientenombre.trim().toUpperCase(),
          createdAt: fechasistema
        });
        await nuevoCliente.save();
        existingIds.add(idNormalizado);
        successCount++;
      } catch (err) { errorCount++; errors.push(`Error en ${clienteData.idcliente}: ${err.message}`); }
    }
    res.json({
      success: true, message: 'Carga masiva de clientes completada',
      data: { total: clientesArray.length, success: successCount, duplicates: duplicateCount, errors: errorCount, errorMessages: errors.slice(0, 10) }
    });
  } catch (error) {
    console.error('❌ Error POST /api/ventas/clientes/bulk:', error);
    res.status(500).json({ success: false, message: 'Error en carga masiva de clientes', error: error.message });
  }
});

app.get('/api/ventas/clientes/id/:idcliente', async (req, res) => {
  try {
    const { idcliente } = req.params;
    const cliente = await Cliente.findOne({ idcliente: idcliente.trim().toUpperCase()});
    if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.json({ success: true, message: 'Cliente obtenido', data: cliente });
  } catch (error) {
    console.error('❌ Error GET /api/ventas/clientes/id/:idcliente:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.get('/api/ventas/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const cliente = await Cliente.findById(id);
    if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.json({ success: true, message: 'Cliente obtenido', data: cliente });
  } catch (error) {
    console.error('❌ Error GET /api/ventas/clientes/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.put('/api/ventas/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const updateData = { ...req.body };
    var fechasistema = formatLocalYmd(new Date());
    delete updateData._id;
    if (updateData.idcliente)

       updateData.clientenombre = updateData.clientenombre.trim().toUpperCase();
       updateData.idglobal = updateData.idglobal;
       updateData.ruccliente = updateData.ruccliente;
       updateData.digitoverificador = updateData.digitoverificador;
       updateData.retenedor = updateData.retenedor.trim().toUpperCase();
       updateData.dir1cliente = updateData.dir1cliente.trim().toUpperCase();
       updateData.dir2cliente = updateData.dir2cliente.trim().toUpperCase();
       updateData.emailcliente = updateData.emailcliente;

       updateData.derpar = updateData.derpar.trim().toUpperCase();
       updateData.telcliente = updateData.telcliente;
       updateData.emailcliente = updateData.emailcliente;
       updateData.faxcliente = updateData.faxcliente;
       updateData.webcliente = updateData.webcliente;
       updateData.tipocontribuyente = updateData.tipocontribuyente;
       updateData.tipoclientefe = updateData.tipoclientefe;
       updateData.estadoctacliente = updateData.estadoctacliente.trim().toUpperCase();
       updateData.limitecredcliente = updateData.limitecredcliente;
      
      updateData.paiscliente = updateData.paiscliente.trim().toUpperCase();
       updateData.provinciacliente = updateData.provinciacliente;
       updateData.clasecliente = updateData.claseCliente;
       updateData.ciudadcliente = updateData.ciudadcliente;
       updateData.vendedorcliente = updateData.vendedorcliente;
       updateData.codigopreciocliente = updateData.codigopreciocliente;
       updateData.estadoctacliente = updateData.estadoctacliente.trim().toUpperCase();
       
      

        const actualizado = await Cliente.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.json({ success: true, message: '✅ Cliente actualizado exitosamente', data: actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/ventas/clientes/:id:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: '❌ El ID de cliente ya está registrado' });
    res.status(500).json({ success: false, message: 'Error al actualizar cliente', error: error.message });
  }
});

app.delete('/api/ventas/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
     const eliminado = await Cliente.findByIdAndDelete(id); 
    if (!eliminado) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.json({ success: true, message: '🗑️ Cliente eliminado (desactivado)' });
  } catch (error) {
    console.error('❌ Error DELETE /api/ventas/clientes/:id:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar cliente', error: error.message });
  }
});

app.put('/api/ventas/clientes/:id/historial/:tipo', async (req, res) => {
  try {
    const { id, tipo } = req.params;
    const { referencia } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const tiposPermitidos = ['facturas', 'cotizacion', 'abonos', 'cambio'];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ success: false, message: `Tipo de historial no válido. Permitidos: ${tiposPermitidos.join(', ')}` });
    }
    if (!referencia?.trim()) return res.status(400).json({ success: false, message: 'La referencia del historial es obligatoria' });
    const campoHistorial = `historial${tipo}`;
    const actualizado = await Cliente.findByIdAndUpdate(
      id,
      { $addToSet: { [campoHistorial]: referencia.trim().toUpperCase() }, $set: { fechaActualizacion: new Date().toISOString() } },
      { new: true }
    );
    if (!actualizado) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.json({ success: true, message: `✅ Registro agregado al historial de ${tipo}`, data: { id: actualizado._id, idcliente: actualizado.idcliente, historialActualizado: actualizado[campoHistorial] } });
  } catch (error) {
    console.error(`❌ Error PUT /api/ventas/clientes/:id/historial/${req.params.tipo}:`, error);
    res.status(500).json({ success: false, message: 'Error al actualizar historial', error: error.message });
  }
});

// ============================================================================
// 🔹 RUTAS: COTIZACIONES
// ============================================================================
// GET /api/ventas/cotizaciones/head
app.get("/api/ventas/cotizaciones/head", async (req, res) => {
  try {
    const { nocotiza } = req.query;
    let query = { activo: { $ne: "N" } };

    if (nocotiza && nocotiza.trim() !== "") {
      query.nocotiza = { $regex: nocotiza.trim(), $options: "i" };
    }

    const cotizaciones = await CotizaHead.find(query).sort({ fechaCreacion: -1 });

    res.json({
      success: true,
      message: `${cotizaciones.length} cotización(es) encontrada(s)`,
      data: cotizaciones
    });
  } catch (err) {
    console.error("❌ Error GET /api/ventas/cotizaciones/head:", err);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      data: []
    });
  }
});

app.post('/api/ventas/cotizaciones/head', async (req, res) => {
  try {
    const { nocotiza, codcliente, fechacotiza } = req.body;
    if (!nocotiza?.trim() || !codcliente?.trim() || !fechacotiza?.trim()) {
      return res.status(400).json({ success: false, message: 'N° Cotización, Cliente y Fecha son obligatorios' });
    }
    var fechasistema = formatLocalYmd(new Date());
    const exists = await CotizaHead.findOne({ nocotiza: nocotiza.trim().toUpperCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Ya existe una cotización con este número' });
    const newHead = await CotizaHead.create({
      ...req.body,
      nocotiza: nocotiza.trim().toUpperCase(),
      codcliente: codcliente.trim().toUpperCase(),
      nombreclie: req.body.nombreclie?.trim().toUpperCase() || '',
      ruccliente: req.body.ruccliente?.trim().toUpperCase() || '',
      codvendedor: req.body.codvendedor?.trim().toUpperCase() || '',
      tipocontribuyente: req.body.tipocontribuyente?.trim().toUpperCase() || '',
      activo : "S",
      fechaCreacion:fechasistema,
      fechaActualizacion: fechasistema,
    });
    res.status(201).json({ success: true, message: '✅ Cabecera de cotización creada', data: newHead });
  } catch (error) {
    console.error('❌ Error POST /api/ventas/cotizaciones/head:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: '❌ El número de cotización ya está registrado' });
    res.status(500).json({ success: false, message: 'Error al crear cotización', error: error.message });
  }
});

app.get('/api/ventas/cotizaciones/head/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const head = await CotizaHead.findById(id);
    if (!head) return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
    res.json({ success: true, message: 'Cotización obtenida', data: head });
  } catch (error) {
    console.error('❌ Error GET /api/ventas/cotizaciones/head/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.get('/api/ventas/cotizaciones/head/nro/:nocotiza', async (req, res) => {
  try {
    const { nocotiza } = req.params; 
const head = await CotizaHead.findOne({ 
    nocotiza: nocotiza.toUpperCase(), 
    $or: [{ activo: "S" }] 
});
    if (!head) return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
    res.json({ success: true, message: 'Cotización obtenida', data: head });
  } catch (error) {
    console.error('❌ Error GET /api/ventas/cotizaciones/head/nro/:nocotiza:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.put('/api/ventas/cotizaciones/head/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const updateData = { ...req.body };
    var fechasistema = formatLocalYmd(new Date());
    delete updateData.nocotiza; delete updateData._id; delete updateData.createdAt; delete updateData.fechaCreacion;
    if (updateData.codcliente) updateData.codcliente = updateData.codcliente.toUpperCase();
    if (updateData.nombreclie) updateData.nombreclie = updateData.nombreclie.toUpperCase();
    if (updateData.ruccliente) updateData.ruccliente = updateData.ruccliente.toUpperCase();
    if (updateData.codvendedor) updateData.codvendedor = updateData.codvendedor.toUpperCase();
    updateData.fechaActualizacion = fechasistema;
    const updated = await CotizaHead.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
    res.json({ success: true, message: '✅ Cotización actualizada', data: updated });
  } catch (error) {
    console.error('❌ Error PUT /api/ventas/cotizaciones/head/:id:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar cotización', error: error.message });
  }
});


// PUT /api/cotizaciones/:id
app.put('/api/ventas/cotizaciones/editar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateBody = req.body;

        // Prevent modification of the primary key field 'nocotiza'
        delete updateBody.nocotiza;

        const updatedCotizacion = await CotizaHead.findByIdAndUpdate(
            id,
            { $set: updateBody },
            { new: true, runValidators: true }
        );

        if (!updatedCotizacion) {
            return res.status(404).json({
                success: false,
                message: "Cotización no encontrada",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cotización actualizada exitosamente",
            data: updatedCotizacion
        });

    } catch (error) {
        console.error("❌ Error updating cotizacion:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error interno del servidor",
            data: null
        });
    }
});

app.delete('/api/ventas/cotizaciones/head/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
     const deleted = await CotizaHead.findByIdAndDelete(id); 
    if (!deleted) return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
    res.json({ success: true, message: '🗑️ Cotización eliminada (desactivada)' });
  } catch (error) {
    console.error('❌ Error DELETE /api/ventas/cotizaciones/head/:id:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar cotización', error: error.message });
  }
});

app.get('/api/ventas/cotizaciones/detalle/nro/:nocotiza', async (req, res) => {
  try {
    const { nocotiza } = req.params;
    const detalles = await CotizaDetalle.find({ nocotiza: nocotiza.toUpperCase()}).sort({ codproducto: 1 });
    res.json({ success: true, message: `${detalles.length} detalle(s) encontrado(s)`, data: detalles });
  } catch (error) {
    console.error('❌ Error GET /api/ventas/cotizaciones/detalle/nro/:nocotiza:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.get('/api/ventas/cotizaciones/detalle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const detalle = await CotizaDetalle.findById(id);
    if (!detalle) return res.status(404).json({ success: false, message: 'Detalle no encontrado' });
    res.json({ success: true, message: 'Detalle obtenido', data: detalle });
  } catch (error) {
    console.error('❌ Error GET /api/ventas/cotizaciones/detalle/:id:', error);
    res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
  }
});

app.post('/api/ventas/cotizaciones/detalle', async (req, res) => {
  try {
    let { detalles } = req.body;
    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ success: false, message: 'Debe enviar al menos un detalle en un array' });
    }
    const nocotiza = detalles[0].nocotiza?.trim().toUpperCase();
    if (!nocotiza || detalles.some(d => d.nocotiza?.trim().toUpperCase() !== nocotiza)) {
      return res.status(400).json({ success: false, message: 'Todos los detalles deben pertenecer a la misma cotización' });
    }
    var fechasistema = formatLocalYmd(new Date());
    const headExists = await CotizaHead.findOne({ nocotiza, activo: true });
    if (!headExists) return res.status(404).json({ success: false, message: 'La cotización de cabecera no existe o está inactiva' });
    const detallesPreparados = detalles.map(detalle => {
      const bruto = (detalle.cantidad || 1) * (detalle.precio || 0);
      const subtotal = bruto - (bruto * ((detalle.descuento || 0) / 100));
      return {
        ...detalle,
        nocotiza: detalle.nocotiza?.trim().toUpperCase(),
        codproducto: detalle.codproducto?.trim().toUpperCase(),
        descripcion: detalle.descripcion?.trim().toUpperCase(),
        cantidad: Math.max(1, detalle.cantidad || 1),
        precio: Math.max(0, detalle.precio || 0),
        descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
        unidad : detalle.unidad?.trim().toUpperCase(),
        subtotal: parseFloat(subtotal.toFixed(2)),
        fechaCreacion: fechasistema
      };
    });
    const creados = await CotizaDetalle.insertMany(detallesPreparados);
    await actualizarTotalesCabecera(nocotiza);
    res.status(201).json({ success: true, message: `✅ ${creados.length} detalle(s) agregado(s) a la cotización`, data: creados });
  } catch (error) {
    console.error('❌ Error POST /api/ventas/cotizaciones/detalle:', error);
    res.status(500).json({ success: false, message: 'Error al agregar detalles', error: error.message });
  }
});

app.put('/api/ventas/cotizaciones/detalle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    const updateData = { ...req.body };
    delete updateData.nocotiza; delete updateData.codproducto; delete updateData._id;
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
    const actualizado = await CotizaDetalle.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ success: false, message: 'Detalle no encontrado' });
    await actualizarTotalesCabecera(actualizado.nocotiza);
    res.json({ success: true, message: '✅ Detalle actualizado', data: actualizado });
  } catch (error) {
    console.error('❌ Error PUT /api/ventas/cotizaciones/detalle/:id:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar detalle', error: error.message });
  }
});

app.delete('/api/ventas/cotizaciones/detalle/:nocotiza', async (req, res) => {
  try {
    const { nocotiza } = req.params;
    
      const eliminado = await CotizaDetalle.deleteMany({nocotiza : nocotiza}); 
    if (!eliminado) return res.status(404).json({ success: false, message: 'Detalles no encontrado' });
    res.json({ success: true, message: '🗑️ Detalles eliminado' });
  } catch (error) {
    console.error('❌ Error DELETE many /api/ventas/cotizaciones/detalle/:nocotiza:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar detalle', error: error.message });
  }
});
app.delete('/api/ventas/cotizaciones/uno/detalle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
     const deleted = await CotizaDetalle.findByIdAndDelete(id); 
    if (!deleted) return res.status(404).json({ success: false, message: 'Detalle Cotización no encontrada' });
    await actualizarTotalesCabecera(deleted.nocotiza);
    res.json({ success: true, message: '🗑️ Detalle Cotización eliminada (desactivada)' });
  } catch (error) {
    console.error('❌ Error DELETE /api/ventas/cotizaciones/uno/detalle/:id:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar detalle cotización', error: error.message });
  }
});


app.post('/api/ventas/cotizaciones/completa', async (req, res) => {
  try {
    const { head, detalles } = req.body;
    if (!head || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ success: false, message: 'Cabecera y al menos un detalle son obligatorios' });
    }
    const exists = await CotizaHead.findOne({ nocotiza: head.nocotiza?.trim().toUpperCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Ya existe una cotización con este número' });
    const detallecotiJson = JSON.stringify(detalles.map(d => ({
      codproducto: d.codproducto, descripcion: d.descripcion, cantidad: d.cantidad,
      precio: d.precio, descuento: d.descuento,
      subtotal: (d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100),
      unidad: d.unidad
    })));
    var fechasistema = formatLocalYmd(new Date());
    const nuevaHead = await CotizaHead.create({
      ...head,
      nocotiza: head.nocotiza.trim().toUpperCase(),
      codcliente: head.codcliente?.trim().toUpperCase(),
      nombreclie: head.nombreclie?.trim().toUpperCase(),
      ruccliente: head.ruccliente?.trim().toUpperCase(),
      codvendedor: head.codvendedor?.trim().toUpperCase(),
      detallecoti: detallecotiJson,
      activo: "S",
      fechaCreacion: fechasistema,
      fechaActualizacion: fechasistema,
      subtotal1: 0, impuesto: 0, subtotal2: 0, total: 0
    });
    const detallesPreparados = detalles.map(detalle => ({
      ...detalle,
      nocotiza: nuevaHead.nocotiza,
      codproducto: detalle.codproducto?.trim().toUpperCase(),
      descripcion: detalle.descripcion?.trim().toUpperCase(),
      cantidad: Math.max(1, detalle.cantidad || 1),
      precio: Math.max(0, detalle.precio || 0),
      unidad: detalle.unidad?.trim().toUpperCase(),
      descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
      subtotal: parseFloat(((detalle.cantidad || 1) * (detalle.precio || 0) * (1 - (detalle.descuento || 0) / 100)).toFixed(2)),
      fechaCreacion: fechasistema
    }));
    await CotizaDetalle.insertMany(detallesPreparados);
    await actualizarTotalesCabecera(nuevaHead.nocotiza);
    const headActualizada = await CotizaHead.findById(nuevaHead._id);
    res.status(201).json({ success: true, message: `✅ Cotización ${nuevaHead.nocotiza} creada con ${detalles.length} producto(s)`, data: headActualizada });
  } catch (error) {
    console.error('❌ Error POST /api/ventas/cotizaciones/completa:', error);
    res.status(500).json({ success: false, message: 'Error al crear cotización completa', error: error.message });
  }
});

// ============================================================================
// 🔹 ACTUALIZAR COTIZACIÓN COMPLETA (para finalizar/fijar)
// ============================================================================
// ============================================================================
// 🔹 GUARDAR / ACTUALIZAR COTIZACIÓN COMPLETA (UPSERT - Finalizar y Guardar)
// ============================================================================
app.put('/api/ventas/cotizaciones/completa/:nocotiza', async (req, res) => {
  try {
    const { nocotiza } = req.params;
    const { head, detalles } = req.body;
    
    if (!head || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ success: false, message: 'Cabecera y al menos un detalle son obligatorios' });
    }
    
    const nocotizaUpper = nocotiza.trim().toUpperCase();
    var fechasistema = formatLocalYmd(new Date());
    
    // Buscar si la cotización ya existe
    let existingHead = await CotizaHead.findOne({ 
      nocotiza: nocotizaUpper,
      $or: [{ activo: "S" }]
    });
    
    let headFinal;
    
    if (!existingHead) {
      // ═══════════════════════════════════════════════════════
      // 🔹 MODO CREAR: La cotización NO existe → Crear nueva
      // ═══════════════════════════════════════════════════════
      const detallecotiJson = JSON.stringify(detalles.map(d => ({
        codproducto: d.codproducto, descripcion: d.descripcion, cantidad: d.cantidad,
        precio: d.precio, descuento: d.descuento,
        subtotal: (d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100),
        unidad: d.unidad
      })));
      
      headFinal = await CotizaHead.create({
        ...head,
        nocotiza: nocotizaUpper,
        codcliente: head.codcliente?.trim().toUpperCase() || '',
        nombreclie: head.nombreclie?.trim().toUpperCase() || '',
        ruccliente: head.ruccliente?.trim().toUpperCase() || '',
        codvendedor: head.codvendedor?.trim().toUpperCase() || '',
        tipocontribuyente: head.tipocontribuyente?.trim().toUpperCase() || '',
        detallecoti: detallecotiJson,
        activo: "S",
        fechaCreacion: fechasistema,
        fechaActualizacion: fechasistema,
        subtotal1: head.subtotal1 || 0,
        descuentoglob: head.descuentoglob || 0,
        impuesto: head.impuesto || 0,
        subtotal2: head.subtotal2 || 0,
        total: head.total || 0
      });
      
    } else {
      // ═══════════════════════════════════════════════════════
      // 🔹 MODO ACTUALIZAR: La cotización existe → Actualizar
      // ═══════════════════════════════════════════════════════
      const updateData = {
        subtotal1: head.subtotal1 || 0,
        descuentoglob: head.descuentoglob || 0,
        impuesto: head.impuesto || 0,
        subtotal2: head.subtotal2 || 0,
        total: head.total || 0,
        detallecoti: head.detallecoti || '[]',
        fechaActualizacion: fechasistema
      };
      
      headFinal = await CotizaHead.findByIdAndUpdate(
        existingHead._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }
    
    // ═══════════════════════════════════════════════════════
    // 🔹 GUARDAR/ACTUALIZAR DETALLES (siempre se ejecuta)
    // ═══════════════════════════════════════════════════════
    for (const detalle of detalles) {
      const detalleExistente = await CotizaDetalle.findOne({ 
        nocotiza: nocotizaUpper, 
        codproducto: detalle.codproducto?.trim().toUpperCase()
      });
      
      const subtotalCalculado = parseFloat(
        ((detalle.cantidad || 1) * (detalle.precio || 0) * (1 - (detalle.descuento || 0) / 100)).toFixed(2)
      );
      
      if (detalleExistente) {
        // Actualizar detalle existente
        await CotizaDetalle.findByIdAndUpdate(detalleExistente._id, {
          $set: {
            cantidad: Math.max(1, detalle.cantidad || 1),
            precio: Math.max(0, detalle.precio || 0),
            descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
            subtotal: subtotalCalculado,
            descripcion: detalle.descripcion?.trim().toUpperCase() || detalleExistente.descripcion,
            fechaActualizacion: fechasistema
          }
        });
      } else {
        // Crear nuevo detalle
        await CotizaDetalle.create({
          nocotiza: nocotizaUpper,
          codproducto: detalle.codproducto?.trim().toUpperCase(),
          descripcion: detalle.descripcion?.trim().toUpperCase(),
          cantidad: Math.max(1, detalle.cantidad || 1),
          precio: Math.max(0, detalle.precio || 0),
          unidad: detalle.unidad?.trim().toUpperCase(),
          descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
          subtotal: subtotalCalculado,
          fechaCreacion: fechasistema
        });
      }
    }
    
    // Recalcular totales finales desde los detalles guardados
   //  await actualizarTotalesCabecera(nocotizaUpper);
    
    // Obtener el estado final
    const headActualizada = await CotizaHead.findById(headFinal._id);
    const detallesFinales = await CotizaDetalle.find({ 
      nocotiza: nocotizaUpper
    });
    
    const mensaje = !existingHead 
      ? `✅ Cotización ${nocotizaUpper} creada con ${detalles.length} producto(s)`
      : `✅ Cotización ${nocotizaUpper} actualizada correctamente`;
    
    res.status(!existingHead ? 201 : 200).json({ 
      success: true, 
      message: mensaje, 
      data: headActualizada,
      detalles: detallesFinales
    });
    
  } catch (error) {
    console.error('❌ Error PUT /api/ventas/cotizaciones/completa:', error);
    res.status(500).json({ success: false, message: 'Error al guardar cotización', error: error.message });
  }
});




app.get('/api/ventas/cotizaciones/pdf/:nocotiza', async (req, res) => {
  try {
    const { nocotiza } = req.params;
    var fechasistema = formatLocalYmd(new Date());
    const head = await CotizaHead.findOne({ nocotiza: nocotiza.toUpperCase(), activo: "S" });
    if (!head) return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
    const detalles = await CotizaDetalle.find({ nocotiza: nocotiza.toUpperCase()});
    const pdfData = {
      cotizacion: {
        numero: head.nocotiza, fecha: head.fechacotiza, vencimiento: head.fechavencimiento,
        cliente: { id: head.codcliente, nombre: head.nombreclie, ruc: head.ruccliente },
        vendedor: head.codvendedor, condiciones: head.condiciones, formaPago: head.formapago, validez: head.validez
      },
      items: detalles.map(d => ({
        codproducto: d.codproducto, descripcion: d.descripcion, cantidad: d.cantidad,
        unidad: d.unidad, precio: d.precio, descuento: d.descuento, subtotal: d.subtotal
      })),
      totales: { subtotal: head.subtotal1, descuento: head.descuentoglob, impuesto: head.impuesto, total: head.total },
      metadata: { generado: fechasistema, empresa: process.env.EMPRESA_NOMBRE || 'ERP Bipymes' }
    };
    res.json({ success: true, message: 'Datos para generación de PDF', data: pdfData });
  } catch (error) {
    console.error('❌ Error GET /api/ventas/cotizaciones/pdf/:nocotiza:', error);
    res.status(500).json({ success: false, message: 'Error al generar PDF', error: error.message });
  }
});

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% LLAMADAS DE LAS FACTURAS DE VENTAS %%%%%%%%%%%%%%%%%

// ============================================================================
// 🔹 RUTAS: FACTURAS ELECTRÓNICAS
// ============================================================================

// ───────── LISTAR FACTURAS ─────────
app.get('/api/ventas/facturas/head', async (req, res) => {
    try {
        const { nofactura, codcliente } = req.query;
        let filters = { activo: { $ne: false } };
        if (nofactura?.trim()) filters.nofactura = { $regex: nofactura.trim(), $options: 'i' };
        if (codcliente?.trim()) filters.codcliente = codcliente.trim().toUpperCase();
        const facturas = await FacturaHead.find(filters).sort({ fechafactura: -1, nofactura: -1 }).limit(100);
        res.json({ success: true, message: `${facturas.length} factura(s) encontrada(s)`, data: facturas });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/head:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ───────── CREAR CABECERA DE FACTURA ─────────
app.post('/api/ventas/facturas/head', async (req, res) => {
    try {
        const { nofactura, codcliente, fechafactura } = req.body;
        if (!nofactura?.trim() || !codcliente?.trim() || !fechafactura?.trim()) {
            return res.status(400).json({ success: false, message: 'N° Factura, Cliente y Fecha son obligatorios' });
        }
        var fechasistema = formatLocalYmd(new Date());
        const exists = await FacturaHead.findOne({ nofactura: nofactura.trim().toUpperCase() });
        if (exists) return res.status(409).json({ success: false, message: 'Ya existe una factura con este número' });
        const newHead = await FacturaHead.create({
            ...req.body,
            nofactura: nofactura.trim().toUpperCase(),
            codcliente: codcliente.trim().toUpperCase(),
            nombreclie: req.body.nombreclie?.trim().toUpperCase() || '',
            ruccliente: req.body.ruccliente?.trim().toUpperCase() || '',
            codvendedor: req.body.codvendedor?.trim().toUpperCase() || '',
            tipocontribuyente: req.body.tipocontribuyente?.trim().toUpperCase() || '',
            estado: 'Pendiente',
            fechaCreacion: fechasistema,
            fechaActualizacion: fechasistema,
        });
        res.status(201).json({ success: true, message: '✅ Cabecera de factura creada', data: newHead });
    } catch (error) {
        console.error('❌ Error POST /api/ventas/facturas/head:', error);
        if (error.code === 11000) return res.status(409).json({ success: false, message: '❌ El número de factura ya está registrado' });
        res.status(500).json({ success: false, message: 'Error al crear factura', error: error.message });
    }
});

// ───────── OBTENER FACTURA POR NÚMERO ─────────
app.get('/api/ventas/facturas/head/nro/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const head = await FacturaHead.findOne({
            nofactura: nofactura.toUpperCase()
        });
        if (!head) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        res.json({ success: true, message: 'Factura obtenida', data: head });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/head/nro/:nofactura:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ───────── OBTENER FACTURA POR ID ─────────
app.get('/api/ventas/facturas/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
        const head = await FacturaHead.findById(id);
        if (!head) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        res.json({ success: true, message: 'Factura obtenida', data: head });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/head/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ───────── ELIMINAR FACTURA ─────────
app.delete('/api/ventas/facturas/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
        const deleted = await FacturaHead.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        res.json({ success: true, message: '🗑️ Factura eliminada' });
    } catch (error) {
        console.error('❌ Error DELETE /api/ventas/facturas/head/:id:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar factura', error: error.message });
    }
});

// ───────── DETALLES POR NÚMERO DE FACTURA ─────────
app.get('/api/ventas/facturas/detalle/nro/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const detalles = await FacturaDetalle.find({ nofactura: nofactura.toUpperCase()}).sort({ codproducto: 1 });
        res.json({ success: true, message: `${detalles.length} detalle(s) encontrado(s)`, data: detalles });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/detalle/nro/:nofactura:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ───────── CREAR FACTURA COMPLETA (HEAD + DETALLES ATÓMICO) ─────────
app.post('/api/ventas/facturas/completa', async (req, res) => {
    try {
        const { head, detalles } = req.body;
        if (!head || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
            return res.status(400).json({ success: false, message: 'Cabecera y al menos un detalle son obligatorios' });
        }
        const exists = await FacturaHead.findOne({ nofactura: head.nofactura?.trim().toUpperCase() });
        if (exists) return res.status(409).json({ success: false, message: 'Ya existe una factura con este número' });
        
        const detallefacturaJson = JSON.stringify(detalles.map(d => ({
            codproducto: d.codproducto, descripcion: d.descripcion, cantidad: d.cantidad,
            precio: d.precio, descuento: d.descuento, impuesto: d.impuesto,
            subtotal: (d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100),
            unidad: d.unidad
        })));
        
        var fechasistema = formatLocalYmd(new Date());
        const nuevaHead = await FacturaHead.create({
            ...head,
            nofactura: head.nofactura.trim().toUpperCase(),
            codcliente: head.codcliente?.trim().toUpperCase() || '',
            nombreclie: head.nombreclie?.trim().toUpperCase() || '',
            ruccliente: head.ruccliente?.trim().toUpperCase() || '',
            codvendedor: head.codvendedor?.trim().toUpperCase() || '',
            tipocontribuyente: head.tipocontribuyente?.trim().toUpperCase() || '',
            detallefactura: detallefacturaJson,
            estado: 'Pendiente',
            fechaCreacion: fechasistema,
            fechaActualizacion: fechasistema,
            subtotal1: 0, impuesto: 0, subtotal2: 0, total: 0
        });
        
        const detallesPreparados = detalles.map(detalle => ({
            ...detalle,
            nofactura: nuevaHead.nofactura,
            codproducto: detalle.codproducto?.trim().toUpperCase(),
            descripcion: detalle.descripcion?.trim().toUpperCase(),
            cantidad: Math.max(1, detalle.cantidad || 1),
            precio: Math.max(0, detalle.precio || 0),
            descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
            subtotal: parseFloat(((detalle.cantidad || 1) * (detalle.precio || 0) * (1 - (detalle.descuento || 0) / 100)).toFixed(2)),
            fechaCreacion: fechasistema
        }));
        
        await FacturaDetalle.insertMany(detallesPreparados);
        const headActualizada = await FacturaHead.findById(nuevaHead._id);
        
        res.status(201).json({ 
            success: true, 
            message: `✅ Factura ${nuevaHead.nofactura} creada con ${detalles.length} producto(s)`, 
            data: headActualizada 
        });
    } catch (error) {
        console.error('❌ Error POST /api/ventas/facturas/completa:', error);
        res.status(500).json({ success: false, message: 'Error al crear factura completa', error: error.message });
    }
});

// ───────── ACTUALIZAR FACTURA COMPLETA (UPSERT - Finalizar y Guardar) ─────────
app.put('/api/ventas/facturas/completa/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const { head, detalles } = req.body;
        if (!head || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
            return res.status(400).json({ success: false, message: 'Cabecera y al menos un detalle son obligatorios' });
        }
        const nofacturaUpper = nofactura.trim().toUpperCase();
        var fechasistema = formatLocalYmd(new Date());
        
        let existingHead = await FacturaHead.findOne({ 
            nofactura: nofacturaUpper
        });
        
        let headFinal;
        if (!existingHead) {
            const detallefacturaJson = JSON.stringify(detalles.map(d => ({
                codproducto: d.codproducto, descripcion: d.descripcion, cantidad: d.cantidad,
                precio: d.precio, descuento: d.descuento, impuesto: d.impuesto,
                subtotal: (d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100),
                unidad: d.unidad
            })));
            headFinal = await FacturaHead.create({
                ...head,
                nofactura: nofacturaUpper,
                codcliente: head.codcliente?.trim().toUpperCase() || '',
                nombreclie: head.nombreclie?.trim().toUpperCase() || '',
                ruccliente: head.ruccliente?.trim().toUpperCase() || '',
                codvendedor: head.codvendedor?.trim().toUpperCase() || '',
                tipocontribuyente: head.tipocontribuyente?.trim().toUpperCase() || '',
                detallefactura: detallefacturaJson,
                estado: 'Pendiente',
                fechaCreacion: fechasistema,
                fechaActualizacion: fechasistema,
                subtotal1: head.subtotal1 || 0,
                descuento: head.descuento || 0,
                impuesto: head.impuesto || 0,
                subtotal2: head.subtotal2 || 0,
                total: head.total || 0
            });
        } else {
            const updateData = {
                subtotal1: head.subtotal1 || 0,
                descuento: head.descuento || 0,
                impuesto: head.impuesto || 0,
                subtotal2: head.subtotal2 || 0,
                total: head.total || 0,
                montoretencion: head.montoretencion || 0,
                detallefactura: head.detallefactura || '[]',
                fechaActualizacion: fechasistema
            };
            headFinal = await FacturaHead.findByIdAndUpdate(
                existingHead._id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }
        
        for (const detalle of detalles) {
            const detalleExistente = await FacturaDetalle.findOne({ 
                nofactura: nofacturaUpper, 
                codproducto: detalle.codproducto?.trim().toUpperCase()
            });
            const subtotalCalculado = parseFloat(
                ((detalle.cantidad || 1) * (detalle.precio || 0) * (1 - (detalle.descuento || 0) / 100)).toFixed(2)
            );
            if (detalleExistente) {
                await FacturaDetalle.findByIdAndUpdate(detalleExistente._id, {
                    $set: {
                        cantidad: Math.max(1, detalle.cantidad || 1),
                        precio: Math.max(0, detalle.precio || 0),
                        descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
                        impuesto: detalle.impuesto || 0,
                        subtotal: subtotalCalculado,
                        descripcion: detalle.descripcion?.trim().toUpperCase() || detalleExistente.descripcion,
                        fechaActualizacion: fechasistema
                    }
                });
            } else {
                await FacturaDetalle.create({
                    nofactura: nofacturaUpper,
                    codproducto: detalle.codproducto?.trim().toUpperCase(),
                    descripcion: detalle.descripcion?.trim().toUpperCase(),
                    cantidad: Math.max(1, detalle.cantidad || 1),
                    precio: Math.max(0, detalle.precio || 0),
                    descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
                    impuesto: detalle.impuesto || 0,
                    subtotal: subtotalCalculado,
                    unidad: detalle.unidad || 'UNIDAD',
                    fechaCreacion: fechasistema
                });
            }
        }
        
        const headActualizada = await FacturaHead.findById(headFinal._id);
        const detallesFinales = await FacturaDetalle.find({ 
            nofactura: nofacturaUpper
        });
        
        const mensaje = !existingHead 
            ? `✅ Factura ${nofacturaUpper} creada con ${detalles.length} producto(s)`
            : `✅ Factura ${nofacturaUpper} actualizada correctamente`;
        
        res.status(!existingHead ? 201 : 200).json({ 
            success: true, 
            message: mensaje, 
            data: headActualizada,
            detalles: detallesFinales
        });
    } catch (error) {
        console.error('❌ Error PUT /api/ventas/facturas/completa:', error);
        res.status(500).json({ success: false, message: 'Error al guardar factura', error: error.message });
    }
});

// ───────── ENVIAR A FACTTORY CORP (SOAP - Placeholder) ─────────
app.post('/api/ventas/facturas/:nofactura/enviar-facttory', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const factura = await FacturaHead.findOne({ nofactura: nofactura.toUpperCase() });
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        
        // TODO: Implementar llamada SOAP real a Facttory Corp Panamá
        // Por ahora simulamos una respuesta exitosa
        factura.facturaelectronica = `CAE-${Date.now()}`;
        factura.estado = 'Aceptada';
        await factura.save();
        
        res.json({ 
            success: true, 
            message: 'Factura enviada a Facttory Corp', 
            data: factura,
            cae: factura.facturaelectronica
        });
    } catch (error) {
        console.error('❌ Error enviar-facttory:', error);
        res.status(500).json({ success: false, message: 'Error al enviar a Facttory', error: error.message });
    }
});

// ───────── ANULAR FACTURA ─────────
app.post('/api/ventas/facturas/:nofactura/anular', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const { motivo } = req.body;
        if (!motivo?.trim()) return res.status(400).json({ success: false, message: 'El motivo de anulación es obligatorio' });
        
        const factura = await FacturaHead.findOne({ nofactura: nofactura.toUpperCase() });
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        
        factura.estado = 'Anulada';
        await factura.save();
        
        res.json({ success: true, message: `Factura anulada. Motivo: ${motivo}`, data: factura });
    } catch (error) {
        console.error('❌ Error anular factura:', error);
        res.status(500).json({ success: false, message: 'Error al anular factura', error: error.message });
    }
});

// ============================================================================
// 🔹 RUTAS: FACTURAS ELECTRÓNICAS
// ============================================================================

// ───────── LISTAR FACTURAS ─────────
app.get('/api/ventas/facturas/head', async (req, res) => {
    try {
        const { nofactura, codcliente } = req.query;
        let filters = { activo: { $ne: false } };
        if (nofactura?.trim()) filters.nofactura = { $regex: nofactura.trim(), $options: 'i' };
        if (codcliente?.trim()) filters.codcliente = codcliente.trim().toUpperCase();
        const facturas = await FacturaHead.find(filters).sort({ fechafactura: -1, nofactura: -1 }).limit(100);
        res.json({ success: true, message: `${facturas.length} factura(s) encontrada(s)`, data: facturas });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/head:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ───────── CREAR CABECERA DE FACTURA ─────────
app.post('/api/ventas/facturas/head', async (req, res) => {
    try {
        const { nofactura, codcliente, fechafactura } = req.body;
        if (!nofactura?.trim() || !codcliente?.trim() || !fechafactura?.trim()) {
            return res.status(400).json({ success: false, message: 'N° Factura, Cliente y Fecha son obligatorios' });
        }
        var fechasistema = formatLocalYmd(new Date());
        const exists = await FacturaHead.findOne({ nofactura: nofactura.trim().toUpperCase() });
        if (exists) return res.status(409).json({ success: false, message: 'Ya existe una factura con este número' });
        const newHead = await FacturaHead.create({
            ...req.body,
            nofactura: nofactura.trim().toUpperCase(),
            codcliente: codcliente.trim().toUpperCase(),
            nombreclie: req.body.nombreclie?.trim().toUpperCase() || '',
            ruccliente: req.body.ruccliente?.trim().toUpperCase() || '',
            codvendedor: req.body.codvendedor?.trim().toUpperCase() || '',
            tipocontribuyente: req.body.tipocontribuyente?.trim().toUpperCase() || '',
            estado: 'Pendiente',
            fechaCreacion: fechasistema,
            fechaActualizacion: fechasistema,
        });
        res.status(201).json({ success: true, message: '✅ Cabecera de factura creada', data: newHead });
    } catch (error) {
        console.error('❌ Error POST /api/ventas/facturas/head:', error);
        if (error.code === 11000) return res.status(409).json({ success: false, message: '❌ El número de factura ya está registrado' });
        res.status(500).json({ success: false, message: 'Error al crear factura', error: error.message });
    }
});

// ───────── OBTENER FACTURA POR NÚMERO ─────────
app.get('/api/ventas/facturas/head/nro/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const head = await FacturaHead.findOne({
            nofactura: nofactura.toUpperCase()
        });
        if (!head) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        res.json({ success: true, message: 'Factura obtenida', data: head });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/head/nro/:nofactura:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ───────── OBTENER FACTURA POR ID ─────────
app.get('/api/ventas/facturas/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
        const head = await FacturaHead.findById(id);
        if (!head) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        res.json({ success: true, message: 'Factura obtenida', data: head });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/head/:id:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ───────── ELIMINAR FACTURA ─────────
app.delete('/api/ventas/facturas/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
        const deleted = await FacturaHead.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        res.json({ success: true, message: '🗑️ Factura eliminada' });
    } catch (error) {
        console.error('❌ Error DELETE /api/ventas/facturas/head/:id:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar factura', error: error.message });
    }
});

// ───────── DETALLES POR NÚMERO DE FACTURA ─────────
app.get('/api/ventas/facturas/detalle/nro/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const detalles = await FacturaDetalle.find({ nofactura: nofactura.toUpperCase()}).sort({ codproducto: 1 });
        res.json({ success: true, message: `${detalles.length} detalle(s) encontrado(s)`, data: detalles });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/detalle/nro/:nofactura:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ───────── CREAR FACTURA COMPLETA (HEAD + DETALLES ATÓMICO) ─────────
app.post('/api/ventas/facturas/completa', async (req, res) => {
    try {
        const { head, detalles } = req.body;
        if (!head || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
            return res.status(400).json({ success: false, message: 'Cabecera y al menos un detalle son obligatorios' });
        }
        const exists = await FacturaHead.findOne({ nofactura: head.nofactura?.trim().toUpperCase() });
        if (exists) return res.status(409).json({ success: false, message: 'Ya existe una factura con este número' });
        
        const detallefacturaJson = JSON.stringify(detalles.map(d => ({
            codproducto: d.codproducto, descripcion: d.descripcion, cantidad: d.cantidad,
            precio: d.precio, descuento: d.descuento, impuesto: d.impuesto,
            subtotal: (d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100),
            unidad: d.unidad
        })));
        
        var fechasistema = formatLocalYmd(new Date());
        const nuevaHead = await FacturaHead.create({
            ...head,
            nofactura: head.nofactura.trim().toUpperCase(),
            codcliente: head.codcliente?.trim().toUpperCase() || '',
            nombreclie: head.nombreclie?.trim().toUpperCase() || '',
            ruccliente: head.ruccliente?.trim().toUpperCase() || '',
            codvendedor: head.codvendedor?.trim().toUpperCase() || '',
            tipocontribuyente: head.tipocontribuyente?.trim().toUpperCase() || '',
            detallefactura: detallefacturaJson,
            estado: 'Pendiente',
            fechaCreacion: fechasistema,
            fechaActualizacion: fechasistema,
            subtotal1: 0, impuesto: 0, subtotal2: 0, total: 0
        });
        
        const detallesPreparados = detalles.map(detalle => ({
            ...detalle,
            nofactura: nuevaHead.nofactura,
            codproducto: detalle.codproducto?.trim().toUpperCase(),
            descripcion: detalle.descripcion?.trim().toUpperCase(),
            cantidad: Math.max(1, detalle.cantidad || 1),
            precio: Math.max(0, detalle.precio || 0),
            descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
            subtotal: parseFloat(((detalle.cantidad || 1) * (detalle.precio || 0) * (1 - (detalle.descuento || 0) / 100)).toFixed(2)),
            fechaCreacion: fechasistema
        }));
        
        await FacturaDetalle.insertMany(detallesPreparados);
        const headActualizada = await FacturaHead.findById(nuevaHead._id);
        
        res.status(201).json({ 
            success: true, 
            message: `✅ Factura ${nuevaHead.nofactura} creada con ${detalles.length} producto(s)`, 
            data: headActualizada 
        });
    } catch (error) {
        console.error('❌ Error POST /api/ventas/facturas/completa:', error);
        res.status(500).json({ success: false, message: 'Error al crear factura completa', error: error.message });
    }
});

// ───────── ACTUALIZAR FACTURA COMPLETA (UPSERT - Finalizar y Guardar) ─────────
app.put('/api/ventas/facturas/completa/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const { head, detalles } = req.body;
        if (!head || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
            return res.status(400).json({ success: false, message: 'Cabecera y al menos un detalle son obligatorios' });
        }
        const nofacturaUpper = nofactura.trim().toUpperCase();
        var fechasistema = formatLocalYmd(new Date());
        
        let existingHead = await FacturaHead.findOne({ 
            nofactura: nofacturaUpper
        });
        
        let headFinal;
        if (!existingHead) {
            const detallefacturaJson = JSON.stringify(detalles.map(d => ({
                codproducto: d.codproducto, descripcion: d.descripcion, cantidad: d.cantidad,
                precio: d.precio, descuento: d.descuento, impuesto: d.impuesto,
                subtotal: (d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100),
                unidad: d.unidad
            })));
            headFinal = await FacturaHead.create({
                ...head,
                nofactura: nofacturaUpper,
                codcliente: head.codcliente?.trim().toUpperCase() || '',
                nombreclie: head.nombreclie?.trim().toUpperCase() || '',
                ruccliente: head.ruccliente?.trim().toUpperCase() || '',
                codvendedor: head.codvendedor?.trim().toUpperCase() || '',
                tipocontribuyente: head.tipocontribuyente?.trim().toUpperCase() || '',
                detallefactura: detallefacturaJson,
                estado: 'Pendiente',
                fechaCreacion: fechasistema,
                fechaActualizacion: fechasistema,
                subtotal1: head.subtotal1 || 0,
                descuento: head.descuento || 0,
                impuesto: head.impuesto || 0,
                subtotal2: head.subtotal2 || 0,
                total: head.total || 0
            });
        } else {
            const updateData = {
                subtotal1: head.subtotal1 || 0,
                descuento: head.descuento || 0,
                impuesto: head.impuesto || 0,
                subtotal2: head.subtotal2 || 0,
                total: head.total || 0,
                montoretencion: head.montoretencion || 0,
                detallefactura: head.detallefactura || '[]',
                fechaActualizacion: fechasistema
            };
            headFinal = await FacturaHead.findByIdAndUpdate(
                existingHead._id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }
        
        for (const detalle of detalles) {
            const detalleExistente = await FacturaDetalle.findOne({ 
                nofactura: nofacturaUpper, 
                codproducto: detalle.codproducto?.trim().toUpperCase()
            });
            const subtotalCalculado = parseFloat(
                ((detalle.cantidad || 1) * (detalle.precio || 0) * (1 - (detalle.descuento || 0) / 100)).toFixed(2)
            );
            if (detalleExistente) {
                await FacturaDetalle.findByIdAndUpdate(detalleExistente._id, {
                    $set: {
                        cantidad: Math.max(1, detalle.cantidad || 1),
                        precio: Math.max(0, detalle.precio || 0),
                        descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
                        impuesto: detalle.impuesto || 0,
                        subtotal: subtotalCalculado,
                        descripcion: detalle.descripcion?.trim().toUpperCase() || detalleExistente.descripcion,
                        fechaActualizacion: fechasistema
                    }
                });
            } else {
                await FacturaDetalle.create({
                    nofactura: nofacturaUpper,
                    codproducto: detalle.codproducto?.trim().toUpperCase(),
                    descripcion: detalle.descripcion?.trim().toUpperCase(),
                    cantidad: Math.max(1, detalle.cantidad || 1),
                    precio: Math.max(0, detalle.precio || 0),
                    descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
                    impuesto: detalle.impuesto || 0,
                    subtotal: subtotalCalculado,
                    unidad: detalle.unidad || 'UNIDAD',
                    fechaCreacion: fechasistema
                });
            }
        }
        
        const headActualizada = await FacturaHead.findById(headFinal._id);
        const detallesFinales = await FacturaDetalle.find({ 
            nofactura: nofacturaUpper,
            activo: { $ne: false }
        });
        
        const mensaje = !existingHead 
            ? `✅ Factura ${nofacturaUpper} creada con ${detalles.length} producto(s)`
            : `✅ Factura ${nofacturaUpper} actualizada correctamente`;
        
        res.status(!existingHead ? 201 : 200).json({ 
            success: true, 
            message: mensaje, 
            data: headActualizada,
            detalles: detallesFinales
        });
    } catch (error) {
        console.error('❌ Error PUT /api/ventas/facturas/completa:', error);
        res.status(500).json({ success: false, message: 'Error al guardar factura', error: error.message });
    }
});

// ───────── ENVIAR A FACTTORY CORP (SOAP - Placeholder) ─────────
app.post('/api/ventas/facturas/:nofactura/enviar-facttory', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const factura = await FacturaHead.findOne({ nofactura: nofactura.toUpperCase() });
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        
        // TODO: Implementar llamada SOAP real a Facttory Corp Panamá
        // Por ahora simulamos una respuesta exitosa
        factura.facturaelectronica = `CAE-${Date.now()}`;
        factura.estado = 'Aceptada';
        await factura.save();
        
        res.json({ 
            success: true, 
            message: 'Factura enviada a Facttory Corp', 
            data: factura,
            cae: factura.facturaelectronica
        });
    } catch (error) {
        console.error('❌ Error enviar-facttory:', error);
        res.status(500).json({ success: false, message: 'Error al enviar a Facttory', error: error.message });
    }
});

// ───────── ANULAR FACTURA ─────────
app.post('/api/ventas/facturas/:nofactura/anular', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const { motivo } = req.body;
        if (!motivo?.trim()) return res.status(400).json({ success: false, message: 'El motivo de anulación es obligatorio' });
        
        const factura = await FacturaHead.findOne({ nofactura: nofactura.toUpperCase() });
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        
        factura.estado = 'Anulada';
        await factura.save();
        
        res.json({ success: true, message: `Factura anulada. Motivo: ${motivo}`, data: factura });
    } catch (error) {
        console.error('❌ Error anular factura:', error);
        res.status(500).json({ success: false, message: 'Error al anular factura', error: error.message });
    }
});
//%%%%%%%%%%%%%% FUNCION DE ELIMINACION LOGICA DEL REGISTRO NO FISICA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  app.delete('/api/vendedor/:id', async (req, res) => {

//  try {

//    const { id } = req.params;

//     var fechasistema = formatLocalYmd(new Date());

//    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });

//    const eliminado = await Vendedor.findByIdAndUpdate(id, { activo: false }, { new: true });

//    if (!eliminado) return res.status(404).json({ success: false, message: 'Vendedor no encontrado' });

//    res.json({ success: true, message: '🗑️ Vendedor eliminado (desactivada)' });

//  } catch (error) {

//    console.error('❌ Error DELETE /api/vendedor/:id:', error);

//    res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });

//  }

//  });


// ============================================================================
// 🔹 HELPERS INTERNOS
// ============================================================================
async function actualizarTotalesCabecera(nocotiza) {
  try {
    const porcentajeImpuesto = ITBMS_PORCENTAJE;
    var fechasistema = formatLocalYmd(new Date());
    const detalles = await CotizaDetalle.find({ nocotiza: nocotiza.toUpperCase()});
    const subtotal1 = detalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);
    const head = await CotizaHead.findOne({ nocotiza: nocotiza.toUpperCase() });
    if (!head) return;
    const descuentoglob = head.descuentoglob || 0;
    const baseImponible = subtotal1 - (subtotal1 * (descuentoglob / 100));
    const impuesto = baseImponible * (porcentajeImpuesto / 100);
    const subtotal2 = baseImponible;
    const total = baseImponible + impuesto;
    await CotizaHead.findOneAndUpdate(
      { nocotiza: nocotiza.toUpperCase() },
      {
        $set: {
          subtotal1: parseFloat(subtotal1.toFixed(2)),
          subtotal2: parseFloat(subtotal2.toFixed(2)),
          impuesto: parseFloat(impuesto.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          fechaActualizacion: fechasistema
        }
      }
    );
  } catch (error) {
    console.error('❌ Error en actualizarTotalesCabecera:', error);
  }
}

// ============================================================================
// 🔥 INICIALIZACIÓN DEL SERVIDOR
// ============================================================================
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Endpoint no encontrado: ${req.method} ${req.originalUrl}` });
});

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
  console.log(`📡 Endpoints activos: /api/health, /api/dashboard, /api/empresa, /api/inventarios/categorias`);
});

   function formatLocalYmd(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }