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
  mesactual: Number,
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
  countnotadebito: { type: String, default: "0" },
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
  vigencialicencia: { type: String, trim: true },
   logoempresa: { type: String, trim: true },
   banner1:{ type: String, trim: true },
   banner2:{ type: String, trim: true },
   banner3:{ type: String, trim: true },

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
  tasaisc: { type: String },
  pormayor : { type : Number },
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
    noidprov: { type : String },
    provincia: { type : String },
   noidistri: { type : String },
   distrito: { type : String },
noidcorre: { type : String },
corregimiento: { type : String },
descripubicacion : { type : String}
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
  distrito: { type: String },
  corregimiento: { type: String },
  vendedorcliente: { type: String },
  codigopreciocliente: { type: String },
  fechaultventa: { type: String },
  historialfacturas: [String],
  historialcotizacion: [String],
  historialabonos: [String],
  historialcambio: [String], 
  latgps: { type: String },
  lnggps: { type: String},
  
  // The GeoJSON field for Google Maps
 
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
 fechafabricacion: { type :String} ,
    fechaexpiracion: { type : String},
    codigobienes: { type : String},
    codigoabrev: { type : String},
    codigogtin: { type : String},
    codigogtininven: { type : String},
    cantigtin: { type : String},
    tasaitbmscod: { type : String},
    valorisc: { type : String },
    tasaoti: { type : String},
    valortasaotro: { type : String},
    hora: { type :String},
  precio: { type: Number },
  descuento: { type: Number },
  impuesto: { type : Number},
  impuesto1: { type : Number},
  impuesto2: { type : Number},
  impuesto3: { type : Number},
   codtasaisc: { type :String},
    tasaisc: { type : String},
  ancho: { type: Number },
  alto: { type: Number },
  numerolote: { type :String},
    cantiprodlote: { type : String},
  unidad: { type: String },
  mercancia: { type: String },
  acabados: { type: String },
   pormayor: { type : Number},
    detventa: { type : String },
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

// ============================================================================
// 🔹 MODELO: FORMA DE PAGO
// ============================================================================
const formaPagoSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true, trim: true, uppercase: true },
    descripcion: { type: String, required: true, trim: true, uppercase: true },
    fechaCreacion: { type: String, default: () => new Date().toISOString() },
    fechaActualizacion: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const FormaPago = mongoose.model('FormaPago', formaPagoSchema);

// ============================================================================
// 🔹 MODELO: PROVEEDORES (Agregar junto a los otros modelos)
// ============================================================================
const proveedorSchema = new mongoose.Schema({
    idprov: { type: String, required: true, unique: true, trim: true, uppercase: true },
    provnombre: { type: String, uppercase: true, trim: true },
    rucprove: { type: String, trim: true },
    dir1prove: { type: String, uppercase: true, trim: true },
    dir2prove: { type: String, uppercase: true, trim: true },
    telprove: { type: String, trim: true },
    emailprove: { type: String, lowercase: true, trim: true },
    compraprove: { type: Number, default: 0 },
    historialcompras: [String],
    historialdevolucion: [String]
}, { timestamps: true });
const Proveedor = mongoose.model('Proveedor', proveedorSchema);

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
    impuesto: { type : Number},
    impuesto1: { type : Number},
    impuesto2: { type : Number},
    impuesto3: { type : Number},
    codtasaisc: { type :String},
    tasaisc: { type : Number},
    ancho: { type : Number},
    alto: { type : Number},
    numerolote: { type :String},
    cantiprodlote: { type : String},
    unidad: { type :String},
    mercancia: { type : String},
    modelo: { type : String},
    fechafabricacion: { type :String} ,
    fechaexpiracion: { type : String},
    codigobienes: { type : String},
    codigoabrev: { type : String},
    codigogtin: { type : String},
    codigogtininven: { type : String},
    cantigtin: { type : String},
    tasaitbmscod: { type : String},
    valorisc: { type : String },
    tasaoti: { type : String},
    valortasaotro: { type : String},
    hora: { type :String},
    acabados: {  type : String},
    pormayor: { type : Number},
    detventa: { type : String },
    especificaciones: { type :String},
    subtotal: { type : Number}
}) 

const FacturaDetalle = mongoose.model('FacturaDetalle', facturadetalleSchema);

// ============================================================================
// 🔹 MODELOS: GASTOS
// ============================================================================
const Schemagastomaestro = new mongoose.Schema({
    codigogasto: { type: String, required: true, unique: true, uppercase: true, trim: true },
    nombregasto: { type: String, uppercase: true, trim: true },
    acumgasto: { type: Number, default: 0 }
}, { timestamps: true });
const GastoHead = mongoose.model('Schemarecgastomaestro', Schemagastomaestro);

const Schemagastotran = new mongoose.Schema({
    codigogasto: { type: String, required: true, uppercase: true, trim: true },
    rucgasto: { type: String, trim: true },
    nombrempresa: { type: String, uppercase: true, trim: true },
    fechatran: { type: String },
    fechafactura: { type: String },
    nofactura: { type: String, trim: true },
    descriptran: { type: String, uppercase: true, trim: true },
    formapago: { type: String, default: '01' },
    impuesto: { type: Number, default: 0 },
    monto: { type: Number, default: 0 }
    });
const GastoTrans = mongoose.model('Schemarecgastotran', Schemagastotran);

var Schemaheadcompra = new mongoose.Schema({
    nodocumento: { type : String },
    fechadocumento: { type : String },
    fechafactura: { type : String },
    fechavencimiento: { type : String },
    nofactura: { type : String },
    codproveedor:{ type: String },
    condiciones: { type : String },
    formapago: { type : String },
    descuento: { type : Number },
    subtotal1: { type : Number },
    impuesto1: { type : Number },
    impuesto2: { type : Number },
    impuesto3: { type : Number },
    impuesto: {  type : Number },
    subtotal2: { type : Number },
    total: { type : Number },
    costoadicional: { type : Number },
    saldo: { type : Number },
    nombreproveedor: { type : String  },
    tipocompra: {  type : String },
    rucproveedor: { type : String },
    seriefiscal: { type : String  },
    transaccion: { type : String  },
    estatuscompra: {  type : String  },
    detallecompra: { type : String },
    historialdevolucion: [String]
});

const ComprasHead = mongoose.model('Schemareccomprahead',Schemaheadcompra);


var Schemadetacompra = new mongoose.Schema({
    nodocumento: { type : String },
    fechadocumento: { type : String  },
    fechafactura: { type : String },
    nofactura: { type : String },
    codproducto:{ type: String },
    descripcion :{ type : String },
    codproveedor: { type : String },
    costo: { type : Number },
    tarifa : { type : Number },
    impuesto: { type : Number },
    descuento: { type : Number  },
    cantidad: { type : Number  },
    hora : { type : String },
    costoadicional: { type : Number },
    detalle :{  type : String  }
});

const CompraDetalle = mongoose.model('Schemareccompradeta',Schemadetacompra);


var Schemaheadcompracosto = new mongoose.Schema({
    nodocumento: { type : String },
    fechadocumento: { type : String },
    fechafactura: { type : String  },
     nofactura: { type : String  },
    codproveedor:{  type: String  },
    condiciones: { type : String  },
    formapago: { type : String   },
    descuento: { type : Number  },
    subtotal1: {  type : Number  },
    impuesto1: { type : Number  },
    impuesto2: { type : Number  },
    impuesto3: { type : Number  },
    impuesto: { type : Number   },
    subtotal2: { type : Number  },
    total: { type : Number },
    costoadicional: { type : Number },
    saldo: { type : Number },
    nombreproveedor: { type : String }
});

const CostoCompraHed = mongoose.model('Schemareccompracostohead',Schemaheadcompracosto);


var Schemadetacompracosto = new mongoose.Schema({
    nodocumento: {type : String  },
    fechadocumento: {  type : String },
    fechafactura: {  type : String },
    nofactura: { type : String },
    codproducto:{ type: String },
    descripcion :{ type : String },
    costo: { type : Number },
    descuento: {  type : Number  },
    cantidad: { type : Number },
    arancel : { type : Number  },
    impuesto : { type : Number  }
});

const CostoCompraDetalle = mongoose.model('Schemareccompradetacosto',Schemadetacompracosto);

var Schemacostodifereport = new mongoose.Schema({
    codproducto: { type : String },
    descripcion: { type : String },
    cantidad: { type : Number  },
    costonvo: { type : Number  },
    costoant: { type : Number  },
    id : { type: mongoose.Schema.Types.ObjectId },
    nuevocosto: { type : Number },
    fechatransaccion: { type : String },
    horatransaccion: {  type : String }
});
const CostoDifer  = mongoose.model('Schemarecdcostodiferente',Schemacostodifereport);
//   DETALLE DE NOTA DE CREDITO 
//============================================================================//
var Schemadetcredito = new mongoose.Schema({
    nocredito: { type : String },
    fechacredito:  {  type : String  },
    codcliente: {  type : String  },
    codvendedor: { type : String  },
    codproducto: { type : String  },
    cantidad: { type : Number  },
    descripcion: {  type : String  },
    descuento: { type : Number  },
    impuesto: { type : Number   },
    impuesto1: { type : Number   },
    impuesto2: { type : Number  },
    impuesto3: { type : Number  },
    codtasaisc: { type : String },
    tasaisc: { type : String },
    precio: { type : Number  },
    fechafabricacion : { type : String },
    fechaexpiracion : { type : String  },
    codigobienes : { type : String  },
    codigogtin : { type : String },
    codigogtininven : { type : String },
    cantigtin : { type : String },
    tasaitbmscod : { type : String },
    tasaisc : { type : String },
    valorisc : { type : String },
    tasaoti : { type : String  },
    valortasaotro : { type : String },
    ancho: { type : Number },
    alto: { type : Number  },
    numerolote: {  type : String },
    cantiprodlote: { type : String },
    unidad: { type : String },
    mercancia : { type : String },
    hora : { type : String  },
    acabados: { type : String },
    linea : { type :String  }
});

const NotaCreditoDetalle  = mongoose.model('Schemareccreditodeta',Schemadetcredito);


var Schemaheadcredito = new mongoose.Schema({
    nocredito: {type : String  },
    nofactura: { type : String  },
nodocumento:{ type : String },
codigosucemisor: { type : String },
    facturaelectronica: { type : String  },
    facturaqr: {  type : String  },
    fechafactura: {  type : String  },
    fechacredito: { type : String  },
    fechavencimiento: { type : String },
    fechaEmision: {  type : String  },
    fechaSalida: { type : String   },
    tipoclientefe: { type : String },
    codcliente: { type : String  },
    idglobalcorpo: { type : String },
    globalnombre: { type : String  },
    naturalezaoperacion: { type : String  },
    tipooperacion: {  type : String  },
    destinooperacion: { type : String },
    formatocafe: {  type : String },
    entregacafe: {  type : String  },
    enviocontenedor: {  type : String  },
    procesogeneracion: {  type : String  },
    ruccliente: { type : String  },
    correocliefe: { type : String  },
    digitoverificadoruc: { type : String  },
    codigosucemisor: {  type : String  },
    tiposucursal: { type : String },
    tipoemision: {  type : String  },
    tipodocumento: { type : String  },
    puntodefacturacion: { type : String },
        tipoventa: { type : String },
        razonsocial:{ type: String },
        direccioncontribuyente:{ type: String  },
    //!!!!!!!!!!!!!!!!!! cuando tipo de cliente de factura es 01 /03
        provincia:{ type: String  },
        distrito:{  type: String  },
        corregimiento:{  type: String  },
        pais:{ type: String },
        paisotro:{ type: String  },
        ubicacionid : { type: String },
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Esto es condicional
        tipoidclientefe:{ type: String },
        numeroidextranjero:{ type: String },
        paisextranjero:{ type: String },
    //!!!!!!!!!!!! solo cuando cliente de factura electronica 01 / 03
    codigoubicacion:{ type: String },
    tipoidentificacion:{  type: String },
    // esto es condicional si   factura electronicao es    04
    identificacionextranjero :{  type: String },
    paisextranjero:{  type: String  },
    //!!!!!!!!!!!!! Datos de factura deExportacion//////
    codicionesentrega:{ type: String },
    monedaexportacion:{ type: String },
    modenaexportanodef:{ type: String  },
    tipodecambio:{ type: String  },
    monedaextranjera:{  type: String  },
    //    Documento fiscal Referenciado
    fechaemisiondocreferenciado :{  type: String  },
    cufereferenciado:{ type: String  },
    nrofacturapapel:{  type: String  },
    nofacturaimpfiscal:{ type: String  },
    // Autorizado descarga Fe
    tipocontribuyente:{ type: String },
    codvendedor:{ type: String  },
    condiciones: { type : String  },
    formapago: {  type : String   },
    descuento: {  type : Number   },
    subtotal1: { type : Number   },
    cotiitbms: { type : String   },
    impuesto: { type : Number  },
    subtotal2: { type : Number  },
    total: { type : Number  },
    saldo: { type : Number  },
    nombreclie: { type : String  },
    ruccliente: { type : String  },
    asignadoa :{  type : String   },
    cedulasignadoa :{ type : String  },
    realizado :{ type : String },
    utilizado :{ type : String },
    cedulautilizado :{ type : String  },
    fechautilizado :{  type :String   },
    facturautilizado :{  type :String  },
    estado:{ type : String  },
    detallecredito: { type : String },
    fechadgiauto: { type : String},
    autorizandgi: { type : String},
    fechaActualizacion: { type : String}
});

const NotaCreditoHead = mongoose.model('Schemareccreditohead',Schemaheadcredito);

var Schemaheaddebito = new mongoose.Schema({
    nofactura: { type : String  },
    nodebito: {  type : String  },
    nodocumento: { type : String },
    facturaelectronica: { type : String },
    fechafactura: { type : String },
    fechadebito: { type : String  },
    fechavencimiento: {  type : String },
    fechaEmision: { type : String },
    fechaSalida: {  type : String  },
    formatocafe: {  type : String  },
    entregacafe: {  type : String  },
    procesogeneracion: { type : String },
    tipocontribuyente:{   type: String  },
    tipoventa: { type : String },
    codigosucemisor: { type : String  },
    tiposucursal: { type : String },
    tipoclientefe: { type : String },
    razonsocial:{ type: String  },
    direccioncontribuyente:{ type: String },
    globalnombre: { type : String },
    correocliefe: { type : String  },
    provincia:{ type: String },
    distrito:{  type: String  },
    corregimiento:{  type: String  },
    pais:{  type: String },
    paisotro:{ type: String  },
    ubicacionid:{ type: String },
    naturalezaoperacion: { type : String },
    tipooperacion: { type : String },
    puntodefacturacion: { type : String },
    tipoidclientefe:{ type: String },
    tipoemision: { type : String  },
    tipodocumento: { type : String },
    codcliente: { type : String },
    estado : {  type : String },
    idglobalcorpo: { type : String },
    globalnombre: { type : String  },
    asignadoa :{ type :String },
    cedulasignadoa :{ type :String },
    realizado :{ type :String },
    utilizado :{ type :String },
    cedulautilizado :{ type :String },
    codvendedor:{  type: String  },
    condiciones: { type : String  },
    formapago: { type : String  },
    descuento: { type : Number  },
    subtotal1: { type : Number  },
    cotiitbms: {  type : String  },
    impuesto: { type : Number },
    subtotal2: { type : Number },
    total: { type : Number },
    saldo: { type : Number },
    coticonvertido: { type : String },
    nombreclie: {  type : String  },
    ruccliente: { type : String   },
    digitoverificadoruc: {type : String  },
    detalledebito: { type : String },
     fechadgiauto: { type : String},
    autorizandgi: { type : String},
    fechaActualizacion: { type : String}
});

const NotaDebitoHead = mongoose.model('Schemarecdebitohead',Schemaheaddebito);

var Schemadetanotadebito = new mongoose.Schema({
    nofactura: { type : String },
    nodebito: {  type : String  },
    fechafactura: { type : String  },
    codcliente: {  type : String  },
    codvendedor: { type : String  },
    codproducto: { type : String  },
    cantidad: { type : Number  },
    descripcion: { type : String  },
    impuesto: { type : Number   },   
    precio: { type : Number },
    costo1: { type : Number },
    ancho: {  type : Number },
    alto: {  type : Number  },
    unidad: { type : String },
    mercancia : { type : String },
    hora : { type : String },
    acabados: { type : String  }
});

const NotaDebitoDetalle  = mongoose.model('Schemarecnotadebitodeta',Schemadetanotadebito);

var Schematranaplicredito = new mongoose.Schema({
    notransaccion: { type : Number },
    nocredito: { type : String  },
    nofactura: { type : String  },
    fechacredito: { type : String  },
    fechatransaccion: { type : String },
    fechavencimiento: { type : String  },
       facturaplicada : { type : String  },  
    codcliente: { type : String },
    codglobal: { type : String  },
    cliente: { type : String    },
utilizado: { type : String },
cedulautilizado: { type : String },
    formapago: { type : String },
    saldoanterior: { type : Number },
    montotran: { type : Number },
comentario:{ type : String }
});

const NotaAplicaCredito = mongoose.model('Schemarectranaplicredito',Schematranaplicredito);

var Schematranaplidebito = new mongoose.Schema({
    notransaccion: { type : Number },
    nodebito: { type : String },
    nofactura: { type : String },
    fechadebito: { type : String },
    fechatransaccion: { type : String },
    fechavencimiento: { type : String  },
       facturaplicada : { type : String },
    codcliente: { type : String },
    codglobal: { type : String  },
    cliente: { type : String   },
utilizado: { type : String } ,
cedulautilizado: { type : String },
    formapago: { type : String  },
    saldoanterior: { type : Number },
    montotran: { type : Number },
comentario:{ type : String }
});

const NotaAplicaDebito = mongoose.model('Schemarectranaplidebito',Schematranaplidebito);

var Schematrancxpagar = new mongoose.Schema({
    notransaccion: { type : Number },
    nodocumento: { type : String  },
    nofactura: { type : String  },
    fechafactura: { type : String },
    fechatransaccion: { type : String },
    fechaabono: { type : String },
    fechavencimiento: { type : String  },
    codproveedor: { type : String },
    provnombre: { type : String  },
    formapago: { type : String  },
    saldoanterior: { type : Number },
    montotran: { type : Number },
    estadotrans: { type : String },
    comentario:{ type : String  }
});

const TranCxPagar = mongoose.model('Schemarectrancxpagar',Schematrancxpagar);

var Schematrancxcobrar = new mongoose.Schema({
    notransaccion: { type : Number },
    nofactura: { type : String },
    fechafactura: {  type : String },
    fechatransaccion: { type : String },
    fechaabono: { type : String },
    fechavencimiento: { type : String },
    codcliente: { type : String },
    codglobal: { type : String },
    cliente: { type : String  },
    formapago: { type : String },
    saldoanterior: { type : Number },
    montotran: { type : Number },
    estadotrans: { type : String },
    comentario:{ type : String }
});

const TranCxCobrar = mongoose.model('Schemarectrancxcobrar',Schematrancxcobrar);
app.get("/api/dashboard", async (req, res) => {
  try {
    // ═══════════════════════════════════════════════════════
    // 🔹 1. CALCULAR DATOS REALES DE COTIZACIONES
    // ═══════════════════════════════════════════════════════
    const todasCotizaciones = await CotizaHead.find({ activo: { $eq: "A" } });
    const cotizacionesTotal = todasCotizaciones.length;

    const cotizacionesConvertidasArr = todasCotizaciones.filter(c => c.coticonvertido === 'S');
    const cotizacionesConvertidas = cotizacionesConvertidasArr.length;
    const cotizacionesNoConvertidas = cotizacionesTotal - cotizacionesConvertidas;

    let porcentajeConversion = 0;
    if (cotizacionesTotal > 0) {
      porcentajeConversion = (cotizacionesConvertidas / cotizacionesTotal) * 100;
    }

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
    
    const currentYear = today.getFullYear();
    const mesActual = today.getMonth() + 1; // 1 = Enero, 12 = Diciembre

    // Consultar facturas por fecha (excluir anuladas)
    const facturasHoy = await FacturaHead.find({ 
      fechafactura: { $regex: `^${todayStr}` }, 
      estado: { $eq: 'A' } 
    });
    const facturasAyer = await FacturaHead.find({ 
      fechafactura: { $regex: `^${yesterdayStr}` }, 
      estado: { $eq: 'A' } 
    });
    const facturasMes = await FacturaHead.find({ 
      fechafactura: { $regex: `^${currentMonthStr}` }, 
      estado: { $eq: 'A' } 
    });

    const ventasHoy = facturasHoy.reduce((sum, f) => sum + (f.total || 0), 0);
    const ventasAyer = facturasAyer.reduce((sum, f) => sum + (f.total || 0), 0);
    const ventasMes = facturasMes.reduce((sum, f) => sum + (f.total || 0), 0);

    const countFacturasHoy = facturasHoy.length;
    const countFacturasAyer = facturasAyer.length;

    let crecimiento = 0;
    if (ventasAyer > 0) {
      crecimiento = ((ventasHoy - ventasAyer) / ventasAyer) * 100;
    }

    // ✅ BULLETPROOF AGGREGATION: Works whether fechafactura is a String or a Date object
    const ventasPorMes = await FacturaHead.aggregate([
      { $match: { estado: { $eq: 'A' } } },
      { 
        $addFields: { 
          // Converts Date to ISO string, or leaves String as is, ensuring $regex works
          fechaStr: { $toString: "$fechafactura" } 
        } 
      },
      { 
        $match: { 
          // Safely matches the year at the start of the string (e.g., "2023" or "2024")
          fechaStr: { $regex: `^${currentYear}` } 
        } 
      },
      {
        $group: {
          _id: { $substr: ["$fechaStr", 5, 2] }, // Extracts "MM" from "YYYY-MM-DD" or ISO string
          totalVentas: { $sum: { $ifNull: ["$total", 0] } }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Create an array of 12 zeros, then populate with real data

const ventasMensuales = Array(12).fill(0);

ventasPorMes.forEach(item => {
  const monthIndex = parseInt(item._id, 10) - 1; // "01" becomes 0, "12" becomes 11

  if (monthIndex >= 0 && monthIndex < 12) {
    ventasMensuales[monthIndex] = parseFloat(item.totalVentas.toFixed(2));
  }
})

// ✅ ENSURE CURRENT MONTH USES THE SAME VERIFIED VALUE AS ventasMes
// ventasMes is already calculated directly from the current month's invoices.
if (mesActual >= 1 && mesActual <= 12) {
  ventasMensuales[mesActual - 1] = parseFloat(ventasMes.toFixed(2));
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
      totalConvertido: parseFloat(totalConvertido.toFixed(2)),
      mesactual: mesActual,               // ✅ FIXED: lowercase 'a' to match Kotlin data class
      ventasMensuales: ventasMensuales
    } : {
      ventasHoy: 0, facturasHoy: 0,
      ventasAyer: 0, facturasAyer: 0,
      ventasMes: 0, crecimiento: 0,
      cotizacionesTotal: 0,
      cotizacionesConvertidas: 0,
      cotizacionesNoConvertidas: 0,
      porcentajeConversion: 0,
      totalCotizado: 0,
      totalConvertido: 0,
      mesactual: mesActual,               // ✅ FIXED: lowercase 'a'
      ventasMensuales: Array(12).fill(0)
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

                // ✅ PARSEAR EL CODIGO (ubicacionid) - Formato: "X-Y-Z"
                // Primer dígito = provincia, Segundo = distrito, Tercero = corregimiento
                const codigoParts = ubicacionid.split('-');
                const noidprov = codigoParts[0] || '';
                const noidistri = codigoParts[1] || '';
                const noidcorre = codigoParts[2] || '';

                // ✅ PARSEAR LA DESCRIPCION - Formato: "PROVINCIA-DISTRITO-CORREGIMIENTO"
                const descParts = descripubicacion.split('-');
                const provincia = (descParts[0] || '').trim();
                const distrito = (descParts[1] || '').trim();
                const corregimiento = (descParts[2] || '').trim();

                // Agregar al array de documentos válidos
                documentosValidos.push({
                    ubicacionid: ubicacionid,
                    descripubicacion: descripubicacion,
                    noidprov: noidprov,
                    provincia: provincia,
                    noidistri: noidistri,
                    distrito: distrito,
                    noidcorre: noidcorre,
                    corregimiento: corregimiento
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
            inserted: successCount,
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
    const { ubicacionid, noidprov, provincia, noidistri, distrito, noidcorre, corregimiento, descripubicacion } = req.body;
    if (!ubicacionid || !descripubicacion) {
      return res.status(400).json({ success: false, message: 'ID, provincia, distrito y corregimiento son obligatorios' });
    }
    const existing = await Ubicacion.findOne({ ubicacionid });
    if (existing) return res.status(409).json({ success: false, message: 'Ya existe una ubicación con este ID' });
    var numcontrol = Math.floor(Math.random() * 10000000);
    const nuevaUbicacion = new Ubicacion({ ubicacionid, noidprov, provincia, noidistri, distrito, noidcorre, corregimiento, descripubicacion });
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

// ============================================================================
// 🔹 REPORTE: INVENTARIO Y RENTABILIDAD
// ============================================================================
app.get('/api/inventarios/reporte/inventario-rentabilidad', async (req, res) => {
    try {
        const { categoria, marca, nombreProducto } = req.query;

        let filter = {};

        if (categoria && categoria.trim() !== '') {
            filter.categoria = { $regex: categoria.trim(), $options: 'i' };
        }
        if (marca && marca.trim() !== '') {
            filter.marca = { $regex: marca.trim(), $options: 'i' };
        }
        if (nombreProducto && nombreProducto.trim() !== '') {
            filter.inventarionombre = { $regex: nombreProducto.trim(), $options: 'i' };
        }

        const productos = await Inventariosede.find(filter).sort({ inventarionombre: 1 });

        // Calculate profitability for each product
        const data = productos.map(p => {
            const cantidispo = p.cantidispo || 0;
            const costo1 = p.costo1 || 0;
            const precio1 = p.precio1 || 0;

            const valorInventario = cantidispo * costo1;
            const valorVentaPotencial = cantidispo * precio1;
            const utilidadPotencial = valorVentaPotencial - valorInventario;
            const margen = precio1 > 0 ? ((precio1 - costo1) / precio1) * 100 : 0;

            return {
                idinventario: p.idinventario || '',
                inventarionombre: p.inventarionombre || '',
                categoria: p.categoria || '',
                subcategoria: p.subcategoria || '',
                marca: p.marca || '',
                modelo: p.modelo || '',
                cantidispo: cantidispo,
                existenciaMin: p.existenciaMin || 0,
                costo1: costo1,
                precio1: precio1,
                valorInventario: parseFloat(valorInventario.toFixed(2)),
                valorVentaPotencial: parseFloat(valorVentaPotencial.toFixed(2)),
                utilidadPotencial: parseFloat(utilidadPotencial.toFixed(2)),
                margen: parseFloat(margen.toFixed(2)),
                bajoStock: cantidispo <= (p.existenciaMin || 0)
            };
        });

        // Summary
        const resumen = {
            totalProductos: data.length,
            totalValorInventario: parseFloat(data.reduce((s, p) => s + p.valorInventario, 0).toFixed(2)),
            totalValorVenta: parseFloat(data.reduce((s, p) => s + p.valorVentaPotencial, 0).toFixed(2)),
            totalUtilidadPotencial: parseFloat(data.reduce((s, p) => s + p.utilidadPotencial, 0).toFixed(2)),
            margenPromedio: data.length > 0
                ? parseFloat((data.reduce((s, p) => s + p.margen, 0) / data.length).toFixed(2))
                : 0,
            productosBajoStock: data.filter(p => p.bajoStock).length
        };

        res.json({
            success: true,
            message: `${data.length} producto(s) encontrado(s)`,
            data: data,
            resumen: resumen
        });

    } catch (error) {
        console.error('❌ Error GET /api/inventarios/reporte/inventario-rentabilidad:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ============================================================================
// 🔹 REPORTE: ROTACIÓN DE INVENTARIO
// ============================================================================
app.get('/api/inventarios/reporte/rotacion', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal } = req.query;

        if (!fechaInicial || !fechaFinal) {
            return res.status(400).json({
                success: false,
                message: 'fechaInicial y fechaFinal son obligatorios',
                data: []
            });
        }

        // Calculate days in period
        const start = new Date(fechaInicial);
        const end = new Date(fechaFinal);
        const diasPeriodo = Math.max(1, Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1);

        // 1. Get all inventory items with cost and quantity
        const inventario = await Inventariosede.find({});

        // 2. Get all sales details in the period
        const facturasEnPeriodo = await FacturaHead.find({
            fechafactura: { $gte: fechaInicial, $lte: fechaFinal },
            estado: { $in: ['A', 'Aceptada'] }
        }, 'nofactura');

        const numerosFactura = facturasEnPeriodo.map(f => f.nofactura).filter(Boolean);

        let detallesVentas = [];
        if (numerosFactura.length > 0) {
            detallesVentas = await FacturaDetalle.find({
                nofactura: { $in: numerosFactura }
            });
        }

        // 3. Build product map from inventory
        const productMap = {};
        inventario.forEach(item => {
            const key = item.idinventario || '';
            if (key) {
                productMap[key] = {
                    codproducto: key,
                    descripcion: item.inventarionombre || '',
                    categoria: item.categoria || '',
                    marca: item.marca || '',
                    cantidispo: item.cantidispo || 0,
                    costo1: item.costo1 || 0,
                    // Ending inventory value
                    valorInventarioFinal: (item.cantidispo || 0) * (item.costo1 || 0),
                    // Quantity sold in period
                    cantidadVendida: 0,
                    // COGS for this product
                    costoVentas: 0
                };
            }
        });

        // 4. Calculate COGS from sales
        detallesVentas.forEach(det => {
            const key = det.codproducto || '';
            if (productMap[key]) {
                const qty = det.cantidad || 0;
                const cost = productMap[key].costo1;
                productMap[key].cantidadVendida += qty;
                productMap[key].costoVentas += qty * cost;
            }
        });

        // 5. Calculate rotation per product
        const productos = Object.values(productMap).map(p => {
            // Beginning Inventory = Ending Inventory + COGS
            const inventarioInicial = p.valorInventarioFinal + p.costoVentas;
            const inventarioFinal = p.valorInventarioFinal;

            // Average Inventory
            const inventarioPromedio = (inventarioInicial + inventarioFinal) / 2;

            // Rotation = COGS / Average Inventory
            const rotacion = inventarioPromedio > 0 ? p.costoVentas / inventarioPromedio : 0;

            // Days of rotation = (Average Inventory × Days) / COGS
            const diasRotacion = p.costoVentas > 0
                ? (inventarioPromedio * diasPeriodo) / p.costoVentas
                : (inventarioPromedio > 0 ? diasPeriodo : 0);

            return {
                codproducto: p.codproducto,
                descripcion: p.descripcion,
                categoria: p.categoria,
                marca: p.marca,
                cantidadDisponible: p.cantidispo,
                costoUnitario: p.costo1,
                valorInventarioFinal: parseFloat(p.valorInventarioFinal.toFixed(2)),
                inventarioInicial: parseFloat(inventarioInicial.toFixed(2)),
                inventarioPromedio: parseFloat(inventarioPromedio.toFixed(2)),
                cantidadVendida: p.cantidadVendida,
                costoVentas: parseFloat(p.costoVentas.toFixed(2)),
                rotacion: parseFloat(rotacion.toFixed(2)),
                diasRotacion: parseFloat(diasRotacion.toFixed(1))
            };
        });

        // Sort by rotation descending
        productos.sort((a, b) => b.rotacion - a.rotacion);

        // 6. Calculate global summary
        const totalCostoVentas = productos.reduce((s, p) => s + p.costoVentas, 0);
        const totalInventarioFinal = productos.reduce((s, p) => s + p.valorInventarioFinal, 0);
        const totalInventarioInicial = productos.reduce((s, p) => s + p.inventarioInicial, 0);
        const totalInventarioPromedio = (totalInventarioInicial + totalInventarioFinal) / 2;

        const rotacionGlobal = totalInventarioPromedio > 0
            ? totalCostoVentas / totalInventarioPromedio
            : 0;

        const diasRotacionGlobal = totalCostoVentas > 0
            ? (totalInventarioPromedio * diasPeriodo) / totalCostoVentas
            : (totalInventarioPromedio > 0 ? diasPeriodo : 0);

        const resumen = {
            diasPeriodo: diasPeriodo,
            totalProductos: productos.length,
            totalCostoVentas: parseFloat(totalCostoVentas.toFixed(2)),
            totalInventarioFinal: parseFloat(totalInventarioFinal.toFixed(2)),
            totalInventarioPromedio: parseFloat(totalInventarioPromedio.toFixed(2)),
            rotacionGlobal: parseFloat(rotacionGlobal.toFixed(2)),
            diasRotacionGlobal: parseFloat(diasRotacionGlobal.toFixed(1)),
            productosConRotacionAlta: productos.filter(p => p.rotacion >= 4).length,
            productosConRotacionBaja: productos.filter(p => p.rotacion < 1).length,
            productosSinMovimiento: productos.filter(p => p.cantidadVendida === 0).length
        };

        res.json({
            success: true,
            message: `${productos.length} producto(s) analizado(s)`,
            data: productos,
            resumen: resumen
        });

    } catch (error) {
        console.error('❌ Error GET /api/inventarios/reporte/rotacion:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message,
            data: []
        });
    }
});
// ============================================================================
// 🔹 REPORTE: COMPARATIVO DE VENTAS MENSUALES
// ============================================================================
app.get('/api/ventas/reportes/comparativo-mensual', async (req, res) => {
    try {
        const { anio } = req.query;
        const anioActual = anio || new Date().getFullYear().toString();

        const mesesNombres = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const meses = [];

        for (let mes = 1; mes <= 12; mes++) {
            const mesStr = String(mes).padStart(2, '0');
            const prefijoMes = `${anioActual}-${mesStr}`;

            const facturas = await FacturaHead.find({
                fechafactura: { $regex: `^${prefijoMes}` },
                estado: { $eq: 'A' }
            });

            const totalVentas = facturas.reduce((sum, f) => sum + (f.total || 0), 0);
            const totalImpuesto = facturas.reduce((sum, f) => sum + (f.impuesto || 0), 0);
            const totalFacturas = facturas.length;

            meses.push({
                mes: mes,
                mesNombre: mesesNombres[mes - 1],
                totalVentas: parseFloat(totalVentas.toFixed(2)),
                totalImpuesto: parseFloat(totalImpuesto.toFixed(2)),
                totalFacturas: totalFacturas
            });
        }

        // Calcular comparativo mes vs mes anterior
        for (let i = 1; i < meses.length; i++) {
            const actual = meses[i].totalVentas;
            const anterior = meses[i - 1].totalVentas;
            const diferencia = actual - anterior;
            const variacion = anterior > 0 ? ((diferencia / anterior) * 100) : 0;

            meses[i].diferencia = parseFloat(diferencia.toFixed(2));
            meses[i].variacion = parseFloat(variacion.toFixed(2));
        }

        // Primer mes no tiene anterior
        meses[0].diferencia = 0;
        meses[0].variacion = 0;

        res.json({
            success: true,
            message: `${meses.length} meses procesados`,
            data: meses,
            anio: anioActual
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/reportes/comparativo-mensual:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
// ============================================================================
// 🔹 REPORTE: ITBMS MENSUAL (IMPUESTOS)
// ============================================================================
app.get('/api/reportes/impuestos/mensual', async (req, res) => {
    try {
        const { anio } = req.query;
        const year = anio || new Date().getFullYear().toString();

        const mesesNombres = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const resultado = [];

        for (let mes = 1; mes <= 12; mes++) {
            const mesStr = mes.toString().padStart(2, '0');
            const mesInicio = `${year}-${mesStr}-01`;
            const mesFin = `${year}-${mesStr}-31`;

            // Acumular impuesto de FacturaHead (ventas)
            const facturas = await FacturaHead.find({
                fechafactura: { $gte: mesInicio, $lte: mesFin },
                estado: { $nin: ['E', 'Anulada'] }
            });
            const impuestoVentas = facturas.reduce((sum, f) => sum + (f.impuesto || 0), 0);

            // Acumular impuesto de ComprasHead (compras)
            const compras = await ComprasHead.find({
                fechafactura: { $gte: mesInicio, $lte: mesFin },
                estatuscompra: { $ne: 'E' }
            });
            const impuestoCompras = compras.reduce((sum, c) => sum + (c.impuesto || 0), 0);

            // Acumular impuesto de GastoTrans (gastos)
            const gastos = await GastoTrans.find({
                fechatran: { $gte: mesInicio, $lte: mesFin }
            });
            const impuestoGastos = gastos.reduce((sum, g) => sum + (g.impuesto || 0), 0);

            // Impuesto a Pagar = (Compras + Gastos) - Ventas
            const impuestoAPagar = (impuestoCompras + impuestoGastos) - impuestoVentas;

            resultado.push({
                mes: mes,
                mesNombre: mesesNombres[mes - 1],
                impuestoVentas: parseFloat(impuestoVentas.toFixed(2)),
                impuestoCompras: parseFloat(impuestoCompras.toFixed(2)),
                impuestoGastos: parseFloat(impuestoGastos.toFixed(2)),
                impuestoAPagar: parseFloat(impuestoAPagar.toFixed(2))
            });
        }

        res.json({
            success: true,
            message: 'Reporte ITBMS mensual generado',
            data: resultado
        });
    } catch (error) {
        console.error('❌ Error GET /api/reportes/impuestos/mensual:', error);
        res.status(500).json({ success: false, message: error.message });
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
//%%%%%%%%%%%%%%%%%%%%%%%%%% PROVEEDORES %%%%%%%%%%%%%%%%%%%%%%%%%//
// GET: Listar todos los proveedores
app.get('/api/compras/proveedores', async (req, res) => {
    try {
        const proveedores = await Proveedor.find({}).sort({ provnombre: 1 });
        res.json({ success: true, message: 'Proveedores obtenidos', data: proveedores });
    } catch (error) {
        console.error('❌ Error GET /api/compras/proveedores:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// POST: Crear proveedor
// In server.js, find the POST /api/compras/proveedores route and replace the Proveedor.create block:

app.post('/api/compras/proveedores', async (req, res) => {
    try {
        const { idprov, provnombre, rucprove, dir1prove, dir2prove, telprove, emailprove } = req.body;
        
        if (!idprov?.trim() || !provnombre?.trim()) {
            return res.status(400).json({ success: false, message: 'ID y Nombre son obligatorios' });
        }
        
        const exists = await Proveedor.findOne({ idprov: idprov.trim().toUpperCase() });
        if (exists) return res.status(409).json({ success: false, message: 'Ya existe un proveedor con este ID' });
    
        // ✅ FIX: Explicitly map fields to prevent Mongoose casting errors from Kotlin's null "_id"
        const nuevoProveedor = await Proveedor.create({
            idprov: idprov.trim().toUpperCase(),
            provnombre: provnombre.trim().toUpperCase(),
            rucprove: rucprove || '',
            dir1prove: dir1prove || '',
            dir2prove: dir2prove || '',
            telprove: telprove || '',
            emailprove: emailprove || '',
            compraprove: 0
        });
        
        res.status(201).json({ success: true, message: '✅ Proveedor creado', data: nuevoProveedor });
    } catch (error) {
        console.error('❌ Error POST /api/compras/proveedores:', error);
        res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
    }
});

// PUT: Editar proveedor
app.put('/api/compras/proveedores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
        
        const updateData = { ...req.body };
        delete updateData.idprov; // No permitir cambiar el ID
        delete updateData._id;
        
        const actualizado = await Proveedor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!actualizado) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
        
        res.json({ success: true, message: '✅ Proveedor actualizado', data: actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/compras/proveedores:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

// DELETE: Eliminar proveedor
app.delete('/api/compras/proveedores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
        
        const eliminado = await Proveedor.findByIdAndDelete(id);
        if (!eliminado) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
        
        res.json({ success: true, message: '🗑️ Proveedor eliminado' });
    } catch (error) {
        console.error('❌ Error DELETE /api/compras/proveedores:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});

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
    let query = { activo: { $eq: "A" } };

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
    if (!nocotiza || !codcliente || !fechacotiza) {
      return res.status(400).json({ success: false, message: 'N° Cotización, Cliente y Fecha son obligatorios' });
    }
    var fechasistema = formatLocalYmd(new Date());
    const exists = await CotizaHead.findOne({ nocotiza: nocotiza.trim().toUpperCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Ya existe una cotización con este número' });
    const newHead = await CotizaHead.create({
      ...req.body,
      nocotiza: nocotiza,
      codcliente: codcliente,
      nombreclie: req.body.nombreclie?.trim().toUpperCase() || '',
      ruccliente: req.body.ruccliente,
      codvendedor: req.body.codvendedor,
      tipocontribuyente: req.body.tipocontribuyente,
      activo : "A",
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
    $or: [{ activo: "A" }] 
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
    if (updateData.codcliente) updateData.codcliente = updateData.codcliente;
    if (updateData.nombreclie) updateData.nombreclie = updateData.nombreclie.toUpperCase();
    if (updateData.ruccliente) updateData.ruccliente = updateData.ruccliente;
    if (updateData.codvendedor) updateData.codvendedor = updateData.codvendedor;
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
// ============================================================================
// 🔹 CONVERTIR COTIZACIÓN A FACTURA
// ============================================================================
app.post('/api/ventas/cotizaciones/convertir/:nocotiza', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    const { nocotiza } = req.params;
    console.log(`\n==================================================`);
    console.log(`🚀 [CONVERTIR] Inicio de proceso para Cotización: "${nocotiza}"`);
    console.log(`==================================================`);

    try {
        if (!nocotiza) {
            console.log(`❌ [CONVERTIR Bad Request] No se proporcionó el parámetro nocotiza.`);
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'El número de cotización es requerido' });
        }

        const nocotizaUpper = nocotiza;

        const fechasistema = typeof formatLocalYmd === 'function' 
            ? formatLocalYmd(new Date()) 
            : new Date().toISOString().slice(0, 10);

        const today = new Date().toISOString().slice(0, 10);

        // 1. OBTENER COTIZACIÓN BASE (CotizaHead)
        console.log(`🔍 [Paso 1] Buscando CotizaHead con nocotiza: "${nocotizaUpper}"...`);
        const cotiza = await CotizaHead.findOne({ nocotiza: nocotizaUpper }).session(session);
        if (!cotiza) {
            console.log(`❌ [Paso 1 Fallo] Cotización "${nocotizaUpper}" no encontrada en la base de datos.`);
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
        }
        console.log(`✅ [Paso 1 Éxito] Cotización encontrada. ID: ${cotiza._id}, Cliente: ${cotiza.codcliente}`);

        // 2. VALIDAR QUE NO HAYA SIDO CONVERTIDA PREVIAMENTE
        console.log(`🔍 [Paso 2] Verificando estado de conversión (coticonvertido: "${cotiza.coticonvertido}")...`);
        if (cotiza.coticonvertido === 'S') {
            console.log(`⚠️ [Paso 2 Fallo] La cotización ya fue convertida previamente.`);
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'Esta cotización ya fue convertida a factura' });
        }
        console.log(`✅ [Paso 2 Éxito] Cotización elegible para conversión.`);

        // Búsqueda opcional del cliente
        const clientebusca = cotiza.codcliente || '';
        console.log(`🔍 [Paso 2.1] Buscando Cliente con ID/Código: "${clientebusca}"...`);
        const cliente = await Cliente.findOne({ 
            $or: [{ idcliente: clientebusca }, { codcliente: clientebusca }] 
        }).session(session);
        console.log(cliente ? `✅ [Cliente Encontrado] ${cliente.clientenombre || cliente.nombre}` : `⚠️ [Cliente No Encontrado] Se usarán datos por defecto de la cotización.`);

        // 3. GENERAR NÚMERO DE FACTURA (10 DÍGITOS) DESDE EMPRESACONFIG
        console.log(`🔍 [Paso 3] Consultando EmpresaConfig para obtener contador de facturas...`);
        const empresa = await EmpresaConfig.findOne({}).session(session);
        if (!empresa) {
            console.log(`❌ [Paso 3 Fallo] Configuración de empresa no encontrada en DB.`);
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'Configuración de empresa no encontrada' });
        }

        const countFactura = parseInt(empresa.countfactura || '0', 10) + 1;
        const nofactura = String(countFactura).padStart(10, '0');
        console.log(`✅ [Paso 3 Éxito] Nuevo número de factura generado: "${nofactura}"`);

        // 4. OBTENER DETALLES DE LA COTIZACIÓN (CotizaDetalle)
        console.log(`🔍 [Paso 4] Buscando CotizaDetalle con nocotiza: "${nocotizaUpper}"...`);
        const cotizaDetalles = await CotizaDetalle.find({ nocotiza: nocotizaUpper }).session(session);
        if (!cotizaDetalles || cotizaDetalles.length === 0) {
            console.log(`❌ [Paso 4 Fallo] No se encontraron líneas de detalle para la cotización "${nocotizaUpper}".`);
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'La cotización no tiene detalles' });
        }
        console.log(`✅ [Paso 4 Éxito] Se encontraron ${cotizaDetalles.length} detalle(s).`);

        // 5. BÚSQUEDA DE PRODUCTOS EN INVENTARIO
        const codigosProductos = cotizaDetalles.map(d => d.codproducto).filter(Boolean);
        console.log(`🔍 [Paso 5] Consultando inventario para ${codigosProductos.length} código(s)...`);
        const inventarios = await Inventariosede.find({ 
            $or: [{ idinventario: { $in: codigosProductos } }, { codproducto: { $in: codigosProductos } }] 
        }).session(session);

        const inventarioMap = new Map();
        inventarios.forEach(item => {
            if (item.idinventario) inventarioMap.set(String(item.idinventario), item);
            if (item.codproducto) inventarioMap.set(String(item.codproducto), item);
        });
        console.log(`✅ [Paso 5 Éxito] ${inventarios.length} producto(s) mapeado(s) desde inventario.`);

        // 6. MAPEADO CON VALORES POR DEFECTO ESTÁNDAR
        console.log(`🔍 [Paso 6] Mapeando detalles de cotización a formato FacturaDetalle...`);
        const facturaDetalles = cotizaDetalles.map((detalle, index) => {
            const itemInv = inventarioMap.get(String(detalle.codproducto)) || {};

            const cantidad = Math.max(1, parseFloat(detalle.cantidad) || 1);
            const precio = Math.max(0, parseFloat(detalle.precio) || 0);
            const descuento = Math.min(100, Math.max(0, parseFloat(detalle.descuento) || 0));

            return {
                nofactura: nofactura,
                fechafactura: fechasistema,
                codcliente: cotiza.codcliente || '',
                codvendedor: cotiza.codvendedor || '',
                codproducto: detalle.codproducto || '',
                cantidad: cantidad,
                descripcion: detalle.descripcion || itemInv.inventarioNombre || '',
                precio: precio,
                descuento: descuento,
                impuesto: parseFloat(detalle.impuesto) || 0,
                impuesto1: parseFloat(itemInv.impuesto1) || 0,
                impuesto2: parseFloat(itemInv.impuesto2) || 0,
                impuesto3: parseFloat(itemInv.impuesto3) || 0,
                codtasaisc: itemInv.codtasaisc || '',
                tasaisc: itemInv.tasaisc || '',
                ancho: 0,
                alto: 0,
                numerolote: '',
                cantiprodlote: '0',
                unidad: detalle.unidad || itemInv.unidad || 'UNIDAD',
                mercancia: detalle.mercancia || '1',
                modelo: detalle.modelo || itemInv.modelo || '',
                fechafabricacion: today,
                fechaexpiracion: today,
                codigobienes: detalle.codigobienes || '0000',
                codigoabrev: '',
                valorisc: String(detalle.valorisc || ''),
                tasaoti: '0',
                hora: new Date().toLocaleTimeString(),
                acabados: detalle.acabados || '',
                pormayor: parseInt(detalle.pormayor || itemInv.pormayor, 10) || 0,
                detventa: '1',
                especificaciones: itemInv.especificaciones || '',
                subtotal: (cantidad * precio) * (1 - (descuento / 100))
            };
        });
        console.log(`✅ [Paso 6 Éxito] Mapeo completado para ${facturaDetalles.length} líneas.`);

        // 7. ENCABEZADO DE FACTURA
        console.log(`🔍 [Paso 7] Construyendo el objeto FacturaHead...`);
        const nuevaFacturaData = {
            nofactura: nofactura,
            facturaelectronica: '',
            facturaqr: '',
            fechafactura: fechasistema,
            fechavencimiento: cotiza.fechavencimiento || fechasistema,
            fechainicial: fechasistema,
            fechafinal: fechasistema,
            procesoalquiler: '',
            fechaEmision: today,
            fechaSalida: today,
            duraciondias: 0,
            retenedor: cotiza.retenedor || '0',
            montoretencion: 0,
            codcliente: cotiza.codcliente || '',
            idglobalcorporp: '0000',
            globalnombre: '',
            tipoclientefe: cotiza.tipoclientefe || '01',
            correocliefe: cliente ? (cliente.emailcliente || '') : '',
            naturalezaoperacion: cotiza.tiponaturaleza || '01',
            tipooperacion: '1',
            destinooperacion: '1',
            formatocafe: '1',
            entregacafe: '1',
            enviocontenedor: '1',
            procesogeneracion: '1',
            ruccliente: cliente ? (cliente.ruccliente || '') : (cotiza.ruccliente || ''),
            digitoverificadoruc: cliente ? (cliente.digitoverificador || '') : '',
            codigosucemisor: empresa.codigosucemisor || '0000',
            tiposucursal: '1',
            tipoemision: '01',
            tipodocumento: cotiza.tipodocumento || '01',
            puntodefacturacion: '001',
            tipoventa: '1',
            razonsocial: (cliente ? cliente.clientenombre : null) || cotiza.nombreclie || 'Consumidor Final',
            direccioncontribuyente: 'PANAMA',
            provincia: 'PANAMA',
            distrito: 'PANAMA',
            corregimiento: 'BETHANIA',
            pais: 'PA',
            paisotro: '',
            ubicacionid: '8-8-6',
            tipoidclientefe: '',
            numeroidextranjero: '',
            telefonowhatsapp: '',
            codigoubicacion: '8-8-6',
            tipoidentificacion: '',
            identificacionextranjero: '',
            paisextranjero: '',
            codicionesentrega: "En Sitio",
            monedaexportacion: '',
            modenaexportanodef: '',
            tipodecambio: '',
            monedaextranjera: '',
            fechaemisiondocreferenciado: today,
            cufereferenciado: '',
            nrofacturapapel: '',
            nofacturaimpfiscal: '',
            tipocontribuyente: cotiza.tipocontribuyente || '1',
            codvendedor: cliente ? (cliente.vendedorcliente || cotiza.codvendedor || '') : (cotiza.codvendedor || ''),
            condiciones: cotiza.condiciones || '1',
            consignacion: 'N',
            formapago: cotiza.formapago || '02',
            descuento: parseFloat(cotiza.descuentoglob) || 0,
            subtotal1: parseFloat(cotiza.subtotal1) || 0,
            cotiitbms: cotiza.cotiitbms || '',
            impuesto: parseFloat(cotiza.impuesto) || 0,
            impuesto1: 0,
            impuesto2: 0,
            impuesto3: 0,
            subtotal2: parseFloat(cotiza.subtotal2) || 0,
            total: parseFloat(cotiza.total) || 0,
            saldo: parseFloat(cotiza.total) || 0,
            entregado: 0,
            cambio: 0,
            coticonvertido: 'S',
            clasefactura: '1',
            nombreclie: cotiza.nombreclie || '',
            seriefiscal: '',
            detallefactura: JSON.stringify(facturaDetalles),
            fechadgiauto: '',
            autorizandgi: '',
            imagen: '',
            centrocosto: '',
            historialnotacredito: [],
            historialnotacambio: [],
            historialnotadebito: [],
            clasecliente: cotiza.clasecliente || '1',
            estado: 'A',
            fechaCreacion: fechasistema,
            fechaActualizacion: fechasistema
        };

        const nuevaFacturaDoc = new FacturaHead(nuevaFacturaData);
        await nuevaFacturaDoc.save({ session });
        console.log(`✅ [Paso 7 Éxito] FacturaHead guardada exitosamente en la sesión.`);

        // 8. INSERTAR DETALLES
        console.log(`🔍 [Paso 8] Insertando FacturaDetalle en la sesión...`);
        if (facturaDetalles.length > 0) {
            await FacturaDetalle.insertMany(facturaDetalles, { session });
            console.log(`✅ [Paso 8 Éxito] FacturaDetalle insertado exitosamente.`);
        }

        // 9. ACTUALIZAR COTIZACIÓN ORIGINAL
        console.log(`🔍 [Paso 9] Actualizando marca de conversión en CotizaHead...`);
        const cotizaActualizada = await CotizaHead.findOneAndUpdate(
            { nocotiza: nocotizaUpper },
            {
                $set: {
                    coticonvertido: 'S',
                    nofactura: nofactura,
                    fechaconvertido: fechasistema,
                    fechaActualizacion: fechasistema
                }
            },
            { new: true, session }
        );

        if (!cotizaActualizada) {
            throw new Error("No se pudo actualizar la cotización tras la conversión");
        }
        console.log(`✅ [Paso 9 Éxito] CotizaHead actualizada a coticonvertido = 'S'.`);

        // 10. ACTUALIZAR EMPRESACONFIG
        console.log(`🔍 [Paso 10] Actualizando contador de factura en EmpresaConfig a ${countFactura}...`);
        await EmpresaConfig.findByIdAndUpdate(
            empresa._id,
            { $set: { countfactura: String(countFactura) } },
            { session }
        );
        console.log(`✅ [Paso 10 Éxito] EmpresaConfig actualizada.`);

        // COMMIT DE LA TRANSACCIÓN
        console.log(`🔍 [Paso Final] Ejecutando commitTransaction...`);
        await session.commitTransaction();

        console.log(`🎉 [ÉXITO TOTAL] Factura ${nofactura} creada exitosamente desde Cotización ${nocotizaUpper}`);

        return res.status(201).json({
            success: true,
            message: `Cotización ${nocotizaUpper} convertida a Factura ${nofactura}`,
            data: cotizaActualizada,
            factura: {
                nofactura: nofactura,
                fechaFactura: fechasistema,
                total: cotiza.total || 0,
                cliente: cotiza.nombreclie || ''
            }
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('❌ ==================================================');
        console.error(`❌ ERROR CRÍTICO AL CONVERTIR COTIZACIÓN "${nocotiza}":`);
        console.error(`❌ Mensaje: ${error.message}`);
        console.error(`❌ Stack Trace:\n`, error.stack || error);
        console.error('❌ ==================================================');

        return res.status(500).json({
            success: false,
            message: 'Error al convertir cotización a factura',
            error: error.message || String(error)
        });
    } finally {
        session.endSession();
        console.log(`🔚 [FIN SESIÓN] Sesión Mongoose cerrada para la conversión de "${nocotiza}".\n`);
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
    const headExists = await CotizaHead.findOne({ nocotiza, activo: "A" });
    if (!headExists) return res.status(404).json({ success: false, message: 'La cotización de cabecera no existe o está inactiva' });
    const detallesPreparados = detalles.map(detalle => {
      const bruto = (detalle.cantidad || 1) * (detalle.precio || 0);
      const subtotal = bruto - (bruto * ((detalle.descuento || 0) / 100));
      return {
        ...detalle,
        nocotiza: detalle.nocotiza,
        codproducto: detalle.codproducto,
        descripcion: detalle.descripcion?.trim().toUpperCase(),
        cantidad: Math.max(1, detalle.cantidad || 1),
        precio: Math.max(0, detalle.precio || 0),
        descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
        unidad : detalle.unidad?.trim().toUpperCase(),
        impuesto: detalle.impuesto || 0,
        impuesto1: detalle.impuesto1 || 0,
        impuesto2: detalle.impuesto2 || 0,
        impuesto3: detalle.impuesto3 || 0,
        pormayor: detalle.pormayor || 0,
        modelo : detalle.modelo,
        fechafabricacion : detalle.fechafabricacion,
        fechaexpiracion : detalle.fechaexpiracion,
        codigobienes : detalle.codigobienes,
        tasaisc : detalle.tasaisc,
        detventa : detalle.detventa,
        ancho: 0,
        alto: 0,
        numerolote: " ",
        cantiprodlote: 0,
        mercancia: "1",
        acabados:detalle.acabados?.trim().toUpperCase(),
        pormayor: 0
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
      nocotiza: head.nocotiza,
      codcliente: head.codcliente,
      nombreclie: head.nombreclie?.trim().toUpperCase(),
      ruccliente: head.ruccliente,
      codvendedor: head.codvendedor,
      detallecoti: detallecotiJson,
      activo: "A",
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
       unidad : detalle.unidad?.trim().toUpperCase(),
        impuesto: detalle.impuesto || 0,
        impuesto1: detalle.impuesto1 || 0,
        impuesto2: detalle.impuesto2 || 0,
        impuesto3: detalle.impuesto3 || 0,
        pormayor: detalle.pormayor || 0,
        modelo : detalle.modelo,
        fechafabricacion : detalle.fechafabricacion,
        fechaexpiracion : detalle.fechaexpiracion,
        codigobienes : detalle.codigobienes,
        tasaisc : detalle.tasaisc,
        detventa : detalle.detventa,
        ancho: 0,
        alto: 0,
        numerolote: " ",
        cantiprodlote: 0,
        mercancia: "1",
        acabados:detalle.acabados?.trim().toUpperCase(),
        pormayor: 0
      
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
      $or: [{ activo: "A" }]
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
        codcliente: head.codcliente,
        nombreclie: head.nombreclie?.trim().toUpperCase(),
        ruccliente: head.ruccliente,
        codvendedor: head.codvendedor,
        tipocontribuyente: head.tipocontribuyente,
        detallecoti: detallecotiJson,
        activo: "A",
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
            descripcion: detalle.descripcion?.trim().toUpperCase() || detalleExistente.descripcion
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
           unidad : detalle.unidad?.trim().toUpperCase(),
        impuesto: detalle.impuesto || 0,
        impuesto1: detalle.impuesto1 || 0,
        impuesto2: detalle.impuesto2 || 0,
        impuesto3: detalle.impuesto3 || 0,
        pormayor: detalle.pormayor || 0,
        modelo : detalle.modelo,
        fechafabricacion : detalle.fechafabricacion,
        fechaexpiracion : detalle.fechaexpiracion,
        codigobienes : detalle.codigobienes,
        tasaisc : detalle.tasaisc,
        detventa : detalle.detventa,
        ancho: 0,
        alto: 0,
        numerolote: " ",
        cantiprodlote: 0,
        mercancia: "1",
        acabados:detalle.acabados?.trim().toUpperCase(),
        pormayor: 0
          
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
    const head = await CotizaHead.findOne({ nocotiza: nocotiza.toUpperCase(), activo: "A" });
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
// ───────── LISTAR FACTURAS ─────────
// ============================================================================
// 🔹 RUTAS: FACTURA HEAD (ELECTRÓNICA)
// ============================================================================

app.get("/api/ventas/facturas/head", async (req, res) => {
  try {
    const { nofactura } = req.query;
    let query = {};
    if (nofactura) {
      query.nofactura = { $regex: nofactura, $options: "i" };
    }
    const facturas = await FacturaHead.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      message: `${facturas.length} factura(s) encontrada(s)`,
      data: facturas
    });
  } catch (error) {
    console.error("❌ Error GET /api/ventas/facturas/head:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener facturas",
      error: error.message
    });
  }
});

app.post("/api/ventas/facturas/head", async (req, res) => {
  try {
    const data = { ...req.body };
    const fechaISO = new Date().toISOString();

    // Asegurar valores predeterminados para campos de control
    if (!data.fechaCreacion) data.fechaCreacion = fechaISO;
    if (!data.fechaActualizacion) data.fechaActualizacion = fechaISO;
    if (!data.estado) data.estado = "A";

    // Sanitizar numéricos si vienen nulos o indefinidos
    data.subtotal1 = data.subtotal1 || 0.0;
    data.subtotal2 = data.subtotal2 || 0.0;
    data.impuesto = data.impuesto || 0.0;
    data.total = data.total || 0.0;
    data.descuento = data.descuento || 0.0;

    const nuevaFacturaHead = new FacturaHead(data);
    const guardada = await nuevaFacturaHead.save();

    res.status(201).json({
      success: true,
      message: "Cabecera de factura creada exitosamente",
      data: guardada
    });
  } catch (error) {
    console.error("❌ Error POST creacion de factura head endpoint  /api/ventas/facturas/head:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al crear cabecera de factura: " + error.message,
      error: error.message
    });
  }
});
//***************************************************************//

app.get('/api/ventas/facturas/head', async (req, res) => {
    try {
        const { nofactura, codcliente } = req.query;
        if (nofactura) filters.nofactura = nofactura;
        if (codcliente) filters.codcliente = codcliente;
        const facturas = await FacturaHead.find({}).sort({ fechafactura: -1, nofactura: -1 }).limit(100);
        res.json({ success: true, message: `${facturas.length} factura(s) encontrada(s)`, data: facturas });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/head:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});


// ============================================================================
// 🔹 REPORTE: VENTAS POR PRODUCTO + RENTABILIDAD
// ============================================================================
app.get('/api/ventas/reportes/ventas-por-producto', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal } = req.query;

        if (!fechaInicial || !fechaFinal) {
            return res.status(400).json({
                success: false,
                message: 'fechaInicial y fechaFinal son obligatorios',
                data: []
            });
        }

        const facturas = await FacturaHead.find(
            {
                fechafactura: {
                    $gte: fechaInicial,
                    $lte: fechaFinal
                },
                estado: {
                    $nin: ['E', 'Anulada', 'Rechazada']
                }
            },
            'nofactura'
        );

        const numerosFactura = facturas.map(f => f.nofactura).filter(Boolean);

        if (!numerosFactura.length) {
            return res.json({
                success: true,
                message: 'No hay ventas en el rango seleccionado',
                data: []
            });
        }

        const data = await FacturaDetalle.aggregate([
            {
                $match: {
                    nofactura: { $in: numerosFactura }
                }
            },
            {
                $group: {
                    _id: {
                        codproducto: { $ifNull: ['$codproducto', ''] },
                        descripcion: { $ifNull: ['$descripcion', ''] }
                    },
                    cantidad: {
                        $sum: { $ifNull: ['$cantidad', 0] }
                    },
                    precio: {
                        $sum: {
                            $multiply: [
                                { $ifNull: ['$cantidad', 0] },
                                { $ifNull: ['$precio', 0] }
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'inventariosedes',
                    localField: '_id.codproducto',
                    foreignField: 'idinventario',
                    as: 'inventario'
                }
            },
            {
                $unwind: {
                    path: '$inventario',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    costoUnitario: {
                        $ifNull: ['$inventario.costo1', 0]
                    }
                }
            },
            {
                $addFields: {
                    costoTotal: {
                        $multiply: ['$cantidad', '$costoUnitario']
                    },
                    utilidad: {
                        $subtract: [
                            '$precio',
                            { $multiply: ['$cantidad', '$costoUnitario'] }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    margen: {
                        $cond: [
                            { $gt: ['$precio', 0] },
                            {
                                $multiply: [
                                    {
                                        $divide: ['$utilidad', '$precio']
                                    },
                                    100
                                ]
                            },
                            0
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    codproducto: '$_id.codproducto',
                    descripcion: '$_id.descripcion',
                    cantidad: 1,
                    precio: 1,
                    costoUnitario: 1,
                    costoTotal: 1,
                    utilidad: 1,
                    margen: 1
                }
            },
            {
                $sort: {
                    precio: -1
                }
            }
        ]);

        res.json({
            success: true,
            message: `${data.length} producto(s) encontrado(s)`,
            data: data
        });

    } catch (error) {
        console.error('❌ Error GET /api/ventas/reportes/ventas-por-producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message,
            data: []
        });
    }
});

// ============================================================================
// 🔹 REPORTE: VENTAS POR CLIENTE
// ============================================================================
app.get('/api/ventas/reporte/ventas-por-cliente', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal, nombreCliente } = req.query;

        // Build date filter
        let dateFilter = {};
        if (fechaInicial && fechaFinal) {
            dateFilter.fechafactura = { $gte: fechaInicial, $lte: fechaFinal };
        } else if (fechaInicial) {
            dateFilter.fechafactura = { $gte: fechaInicial };
        } else if (fechaFinal) {
            dateFilter.fechafactura = { $lte: fechaFinal };
        }

        // Build client name filter (only if provided and not blank)
        let clientFilter = {};
        if (nombreCliente && nombreCliente.trim() !== '') {
            clientFilter.nombreclie = { $regex: nombreCliente.trim(), $options: 'i' };
        }

        // Combine filters - only include non-cancelled invoices
        const query = {
            ...dateFilter,
            ...clientFilter,
            estado: { $nin: ['E', 'Anulada', 'Rechazada'] }
        };

        const facturas = await FacturaHead.find(query);

        // Group by client
        const clientMap = {};
        facturas.forEach(f => {
            const key = f.codcliente || f.nombreclie || 'SIN CLIENTE';
            if (!clientMap[key]) {
                clientMap[key] = {
                    codcliente: f.codcliente ,
                    nombreclie: f.nombreclie || 'SIN CLIENTE',
                    ruccliente: f.ruccliente ,
                    digitoverificadoruc: f.digitoverificadoruc,
                    totalFacturas: 0,
                    totalVentas: 0,
                    totalImpuesto: 0,
                    totalDescuento: 0,
                    ultimaFactura: '',
                    ultimaFechaFactura: '',
                    primeraFactura: '',
                    primeraFechaFactura: '',
                    tipocontribuyente: f.tipocontribuyente ,
                    tipoclientefe: f.tipoclientefe,
                    clasecliente: f.clasecliente
                };
            }
            clientMap[key].totalFacturas += 1;
            clientMap[key].totalVentas += (f.total || 0);
            clientMap[key].totalImpuesto += (f.impuesto || 0);
            clientMap[key].totalDescuento += (f.descuento || 0);

            // Track latest and earliest invoice
            if (!clientMap[key].ultimaFechaFactura || f.fechafactura > clientMap[key].ultimaFechaFactura) {
                clientMap[key].ultimaFactura = f.nofactura;
                clientMap[key].ultimaFechaFactura = f.fechafactura;
            }
            if (!clientMap[key].primeraFechaFactura || f.fechafactura < clientMap[key].primeraFechaFactura) {
                clientMap[key].primeraFactura = f.nofactura;
                clientMap[key].primeraFechaFactura = f.fechafactura;
            }
        });

        // Convert to sorted array (by totalVentas descending)
        const data = Object.values(clientMap).sort((a, b) => b.totalVentas - a.totalVentas);

        // Calculate summary
        const resumen = {
            totalClientes: data.length,
            totalFacturas: data.reduce((s, c) => s + c.totalFacturas, 0),
            totalVentasGeneral: data.reduce((s, c) => s + c.totalVentas, 0),
            totalImpuestoGeneral: data.reduce((s, c) => s + c.totalImpuesto, 0)
        };

        res.json({
            success: true,
            message: `${data.length} cliente(s) encontrado(s)`,
            data: data,
            resumen: resumen
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/reporte/ventas-por-cliente:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ============================================================================
// 🔹 RUTAS: CUENTAS POR COBRAR (CXC)
// ============================================================================

// 1) LISTAR FACTURAS A CRÉDITO (condiciones != '1') CON FILTROS
app.get('/api/ventas/cxc/facturas', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal, nombreCliente } = req.query;

        let filter = {
            condiciones: { $ne: '1' },  // Solo facturas a crédito
            estado: { $nin: ['E', 'Anulada'] }  // Excluir anuladas
        };

        if (fechaInicial && fechaFinal) {
            filter.fechafactura = { $gte: fechaInicial, $lte: fechaFinal };
        } else if (fechaInicial) {
            filter.fechafactura = { $gte: fechaInicial };
        } else if (fechaFinal) {
            filter.fechafactura = { $lte: fechaFinal };
        }

        if (nombreCliente && nombreCliente.trim() !== '') {
            filter.nombreclie = { $regex: nombreCliente.trim(), $options: 'i' };
        }

        const facturas = await FacturaHead.find(filter).sort({ fechafactura: -1 });

        res.json({
            success: true,
            message: `${facturas.length} factura(s) a crédito encontrada(s)`,
            data: facturas
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/cxc/facturas:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// 2) CREAR ABONO (TRAN CXC COBRAR)
app.post('/api/ventas/cxc/abono', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { nofactura, montotran, formapago, fechaabono, comentario } = req.body;

        if (!nofactura) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'Número de factura es obligatorio' });
        }

        const factura = await FacturaHead.findOne({ nofactura: nofactura }).session(session);
        if (!factura) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        }

        // Calcular abonos previos para esta factura
        const abonosPrevios = await TranCxCobrar.find({ nofactura: nofactura }).session(session);
        const totalAbonado = abonosPrevios.reduce((sum, a) => sum + (a.montotran), 0);
        const saldoActual = (factura.total) - totalAbonado;

        const montoAbono = parseFloat(montotran);
        if (montoAbono <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'El monto del abono debe ser mayor a 0' });
        }

        if (montoAbono > saldoActual) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: `El abono (${montoAbono.toFixed(2)}) excede el saldo pendiente (${saldoActual.toFixed(2)})`
            });
        }

        // Generar número de transacción consecutivo
        const lastTran = await TranCxCobrar.findOne().sort({ notransaccion: -1 }).session(session);
        const notransaccion = (lastTran && lastTran.notransaccion ? lastTran.notransaccion : 0) + 1;
        const fechasistema = formatLocalYmd(new Date());

        const nuevoAbono = new TranCxCobrar({
            notransaccion: notransaccion,
            nofactura: factura.nofactura,
            fechafactura: factura.fechafactura,
            fechatransaccion: fechasistema,
            fechaabono: fechaabono || fechasistema,
            fechavencimiento: factura.fechavencimiento,
            codcliente: factura.codcliente,
            codglobal: factura.idglobalcorporp,
            cliente: factura.nombreclie,
            formapago: formapago || '02',
            saldoanterior: saldoActual,
            montotran: montoAbono,
            estadotrans: 'A',
            comentario: comentario || ''
        });
        await nuevoAbono.save({ session });

        // Actualizar saldo de la factura
        const nuevoSaldo = saldoActual - montoAbono;
        await FacturaHead.findOneAndUpdate(
            { nofactura: nofactura.trim() },
            { $set: { saldo: nuevoSaldo, fechaActualizacion: new Date().toISOString() } },
            { new: true, session }
        );

        await session.commitTransaction();
        res.status(201).json({
            success: true,
            message: '✅ Abono registrado exitosamente',
            data: nuevoAbono
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('❌ Error POST /api/ventas/cxc/abono:', error);
        res.status(500).json({ success: false, message: 'Error al registrar abono', error: error.message });
    } finally {
        session.endSession();
    }
});

// ============================================================================
// 🔹 EXPORTAR FACTURAS POR RANGO DE FECHAS
// ============================================================================
app.get('/api/ventas/facturas/exportar', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal } = req.query;

        let filter = {
            estado: { $nin: ['E', 'Anulada'] }
        };

        if (fechaInicial && fechaFinal) {
            filter.fechafactura = { $gte: fechaInicial, $lte: fechaFinal };
        } else if (fechaInicial) {
            filter.fechafactura = { $gte: fechaInicial };
        } else if (fechaFinal) {
            filter.fechafactura = { $lte: fechaFinal };
        }

        const facturas = await FacturaHead.find(filter)
            .sort({ fechafactura: -1, nofactura: -1 });

        res.json({
            success: true,
            message: `${facturas.length} factura(s) encontrada(s)`,
            data: facturas
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/exportar:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// 3) ESTADO DE CUENTA POR CLIENTE
app.get('/api/ventas/cxc/estado/:codcliente', async (req, res) => {
    try {
        const { codcliente } = req.params;

        // Facturas a crédito del cliente
        const facturas = await FacturaHead.find({
            codcliente: codcliente,
            condiciones: { $ne: '1' },
            estado: { $nin: ['E', 'Anulada'] }
        }).sort({ fechafactura: 1 });

        // Abonos del cliente
        const abonos = await TranCxCobrar.find({
            codcliente: codcliente
        }).sort({ fechatransaccion: 1 });

        const saldoTotal = facturas.reduce((sum, f) => sum + (f.saldo || f.total || 0), 0);
        const totalAbonado = abonos.reduce((sum, a) => sum + (a.montotran || 0), 0);

        res.json({
            success: true,
            message: 'Estado de cuenta obtenido',
            data: {
                codcliente: codcliente,
                cliente: facturas.length > 0 ? facturas[0].nombreclie : '',
                saldoTotal: saldoTotal,
                totalAbonado: totalAbonado,
                facturas: facturas,
                abonos: abonos
            }
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/cxc/estado:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// 4) RESÚMENES DE SALDOS POR CLIENTE
app.get('/api/ventas/cxc/saldos', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal, nombreCliente } = req.query;

        let filter = {
            condiciones: { $ne: '1' },
            estado: { $nin: ['E', 'Anulada'] }
        };

        if (fechaInicial && fechaFinal) {
            filter.fechafactura = { $gte: fechaInicial, $lte: fechaFinal };
        }
        if (nombreCliente && nombreCliente.trim() !== '') {
            filter.nombreclie = { $regex: nombreCliente.trim(), $options: 'i' };
        }

        const facturas = await FacturaHead.find(filter);

        // Agrupar por cliente
        const clienteMap = {};
        facturas.forEach(f => {
            const key = f.codcliente;
            if (!clienteMap[key]) {
                clienteMap[key] = {
                    codcliente: f.codcliente,
                    cliente: f.nombreclie,
                    totalFacturado: 0,
                    totalAbonado: 0,
                    saldoPendiente: 0,
                    facturas: []
                };
            }
            clienteMap[key].totalFacturado += (f.total || 0);
            clienteMap[key].saldoPendiente += (f.saldo || 0);
            clienteMap[key].facturas.push(f);
        });

        // Calcular abonos por cliente
        for (const key in clienteMap) {
            const abonos = await TranCxCobrar.find({ codcliente: key });
            clienteMap[key].totalAbonado = abonos.reduce((sum, a) => sum + (a.montotran || 0), 0);
            clienteMap[key].saldoPendiente = clienteMap[key].totalFacturado - clienteMap[key].totalAbonado;
        }

        const saldos = Object.values(clienteMap).sort((a, b) => b.saldoPendiente - a.saldoPendiente);

        res.json({
            success: true,
            message: `${saldos.length} cliente(s) con saldo pendiente`,
            data: saldos
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/cxc/saldos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ============================================================================
// 🔹 CUENTAS POR COBRAR - AGING REPORT
// ============================================================================
app.get('/api/ventas/cxc/aging', async (req, res) => {
    try {
        // 1. GET ALL CREDIT INVOICES WITH OUTSTANDING BALANCE
        const facturasCredito = await FacturaHead.find({
            condiciones: { $ne: '1' },       // Only credit sales
            estado: { $nin: ['E', 'Anulada'] }, // Exclude cancelled
            saldo: { $gt: 0 }                // Only with outstanding balance
        }).sort({ fechavencimiento: 1 });

        // 2. CALCULATE TODAY (midnight)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 3. DEFINE AGING BUCKETS
        const buckets = {
            al_dia:    { rango: 'Al día (no vencido)', diasMin: -9999, diasMax: 0,   facturas: [], totalMonto: 0 },
            d1_30:     { rango: '1 - 30 días',         diasMin: 1,     diasMax: 30,  facturas: [], totalMonto: 0 },
            d31_60:    { rango: '31 - 60 días',        diasMin: 31,    diasMax: 60,  facturas: [], totalMonto: 0 },
            d61_90:    { rango: '61 - 90 días',        diasMin: 61,    diasMax: 90,  facturas: [], totalMonto: 0 },
            d91_mas:   { rango: 'Más de 90 días',      diasMin: 91,    diasMax: 99999, facturas: [], totalMonto: 0 }
        };

        // 4. CLASSIFY EACH INVOICE INTO A BUCKET
        for (const factura of facturasCredito) {
            // Parse due date (fechavencimiento)
            let diasVencidos = 0;

            if (factura.fechavencimiento) {
                const parts = factura.fechavencimiento.split('-');
                const vencDate = new Date(
                    parseInt(parts[0]),
                    parseInt(parts[1]) - 1,
                    parseInt(parts[2])
                );
                vencDate.setHours(0, 0, 0, 0);

                // Days past due: positive = overdue, negative = not yet due
                diasVencidos = Math.floor((today - vencDate) / (1000 * 60 * 60 * 24));
            }

            // Build summary object for this invoice
            const facturaResumen = {
                nofactura: factura.nofactura,
                nombreclie: factura.nombreclie,
                codcliente: factura.codcliente,
                fechafactura: factura.fechafactura,
                fechavencimiento: factura.fechavencimiento,
                total: factura.total || 0,
                saldo: factura.saldo || 0,
                diasVencidos: diasVencidos
            };

            // Assign to correct bucket
            if (diasVencidos <= 0) {
                buckets.al_dia.facturas.push(facturaResumen);
                buckets.al_dia.totalMonto += facturaResumen.saldo;
            } else if (diasVencidos <= 30) {
                buckets.d1_30.facturas.push(facturaResumen);
                buckets.d1_30.totalMonto += facturaResumen.saldo;
            } else if (diasVencidos <= 60) {
                buckets.d31_60.facturas.push(facturaResumen);
                buckets.d31_60.totalMonto += facturaResumen.saldo;
            } else if (diasVencidos <= 90) {
                buckets.d61_90.facturas.push(facturaResumen);
                buckets.d61_90.totalMonto += facturaResumen.saldo;
            } else {
                buckets.d91_mas.facturas.push(facturaResumen);
                buckets.d91_mas.totalMonto += facturaResumen.saldo;
            }
        }

        // 5. BUILD RESPONSE ARRAY
        const bucketsArray = [
            buckets.al_dia,
            buckets.d1_30,
            buckets.d31_60,
            buckets.d61_90,
            buckets.d91_mas
        ].map(b => ({
            rango: b.rango,
            cantidadFacturas: b.facturas.length,
            totalMonto: parseFloat(b.totalMonto.toFixed(2)),
            facturas: b.facturas
        }));

        const totalFacturas = facturasCredito.length;
        const totalMonto = bucketsArray.reduce((sum, b) => sum + b.totalMonto, 0);

        res.json({
            success: true,
            message: `${totalFacturas} factura(s) a crédito con saldo pendiente`,
            data: {
                buckets: bucketsArray,
                totalFacturas: totalFacturas,
                totalMonto: parseFloat(totalMonto.toFixed(2))
            }
        });

    } catch (error) {
        console.error('❌ Error GET /api/ventas/cxc/aging:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor al generar Aging Report',
            error: error.message
        });
    }
});
// ───────── CREAR CABECERA DE FACTURA ─────────

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

app.put('/api/ventas/facturas/anular/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
               // Prevent modification of the primary key field 'nocotiza'
        const head = await FacturaHead.findOne({
            _id: id
        });

        var fechaini = head.fechafactura
        // 1. Define your initial date (format: yyyy-mm-dd)
// 2. Parse the date safely 
// (Splitting the string avoids the UTC timezone shift bug in JavaScript)
const [year, month, day] = fechaini.split('-').map(Number);
const initialDate = new Date(year, month - 1, day); // month - 1 because JS months are 0-indexed

// 3. Get today's date and reset the time to midnight (00:00:00)
// This ensures we are comparing exact calendar days, ignoring hours/minutes
const today = new Date();
today.setHours(0, 0, 0, 0);

// 4. Calculate the absolute difference in milliseconds
const diffInMs = Math.abs(today.getTime() - initialDate.getTime());

// 5. Convert milliseconds to days
const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

// Output the results
console.log(`Initial Date: ${fechaini}`);
console.log(`Today's Date: ${today.toISOString().split('T')[0]}`);
console.log(`Difference: ${diffInDays} days`);
        
if ( diffInDays <= 5 ) { 
            const updatedFacturaAnular = await FacturaHead.findByIdAndUpdate(
                 id,
                 { $set: { estado : "E" }},
                 { new: true, runValidators: true }
             );
             
            // 🔹 REVERTIR INVENTARIO LOCALMENTE
            if (updatedFacturaAnular) {
                const detalles = await FacturaDetalle.find({ nofactura: updatedFacturaAnular.nofactura });
                for (const det of detalles) {
                    if (det.codproducto) {
                        await Inventariosede.findOneAndUpdate(
                            { idinventario: det.codproducto },
                            { $inc: { cantidispo: (det.cantidad || 0) } }
                        );
                    }
                }
            }

        if (!updatedFacturaAnular) {
            return res.status(404).json({
                success: false,
                message: "Factura no encontrada",
                data: null
            });
        }

         return res.status(200).json({
             success: true,
             message: "Factura Anulada exitosamente",
             data: updatedFacturaAnular // <--- CORREGIDO
         });
      }
    } catch (error) {
        console.error("❌ Error Anular Factura :", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error interno del servidor",
            data: null
        });
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
        const detalles = await FacturaDetalle.find({ nofactura: nofactura}).sort({ codproducto: 1 });
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
        const exists = await FacturaHead.findOne({ nofactura: head.nofactura });
        if (exists) return res.status(409).json({ success: false, message: 'Ya existe una factura con este número' });
        
        const detallefacturaJson = JSON.stringify(detalles.map(d => ({
            codproducto: d.codproducto, descripcion: d.descripcion, cantidad: d.cantidad,
            precio: d.precio, descuento: d.descuento, impuesto: d.impuesto,
            subtotal: (d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100),
             unidad: d.unidad, impuesto: d.impuesto, impuesto1 : d.impuesto1, impuesto2 : d.impuesto2,
             impuesto3 : d.impuesto3, modelo : d.modelo, pormayor : d.pormayor, tasaisc : d.tasaisc,
             codigobienes : d.codigobienes, fechafabricacion : d.fechafabricacion, fechaexpiracion : d.fechaexpiracion
        })));
        
        var fechasistema = formatLocalYmd(new Date());
        const nuevaHead = await FacturaHead.create({
            ...head,
            nofactura: head.nofactura,
            codcliente: head.codcliente,
            nombreclie: head.nombreclie,
            ruccliente: head.ruccliente,
            codvendedor: head.codvendedor,
            tipocontribuyente: head.tipocontribuyente,
            detallefactura: detallefacturaJson,
            estado: 'A',
            fechaCreacion: fechasistema,
            fechaActualizacion: fechasistema,
            subtotal1: 0, impuesto: 0, subtotal2: 0, total: 0
        });
        
        const detallesPreparados = detalles.map(detalle => ({
            ...detalle,
            nofactura: nuevaHead.nofactura,
            codproducto: detalle.codproducto,
            descripcion: detalle.descripcion,
             impuesto: detalle.impuesto || 0,
                        impuesto1: detalle.impuesto1 || 0,
                        impuesto2: detalle.impuesto2 || 0,
                        impuesto3: detalle.impuesto3 || 0,
                        pormayor: detalle.pormayor || 0,
                        unidad: detalle.unidad || 'UND',
                        modelo : detalle.modelo,
                        fechafabricacion : detalle.fechafabricacion,
                        fechaexpiracion : detalle.fechaexpiracion,
                        codigobienes : detalle.codigobienes,
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
        const nofacturaUpper = nofactura;
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
                 unidad: d.unidad, impuesto: d.impuesto, impuesto1 : d.impuesto1, impuesto2 : d.impuesto2,
             impuesto3 : d.impuesto3, modelo : d.modelo, pormayor : d.pormayor, tasaisc : d.tasaisc,detventa: d.detventa?.toString() || '1',
             codigobienes : d.codigobienes, fechafabricacion : d.fechafabricacion, fechaexpiracion : d.fechaexpiracion
            })));
            headFinal = await FacturaHead.create({
                ...head,
                nofactura: nofacturaUpper,
                codcliente: head.codcliente,
                nombreclie: head.nombreclie,
                ruccliente: head.ruccliente,
                codvendedor: head.codvendedor,
                tipocontribuyente: head.tipocontribuyente,
                detallefactura: detallefacturaJson,
                estado: 'A',
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
                { returnDocument: 'after', runValidators: true } 
            );
        }
        
        for (const detalle of detalles) {
            const detalleExistente = await FacturaDetalle.findOne({ 
                nofactura: nofacturaUpper, 
                codproducto: detalle.codproducto
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
                        impuesto1: detalle.impuesto1 || 0,
                        impuesto2: detalle.impuesto2 || 0,
                        impuesto3: detalle.impuesto3 || 0,
                        pormayor: detalle.pormayor || 0,
                        descripcion: detalle.descripcion,
                        unidad: detalle.unidad || 'UND',
                        modelo : detalle.modelo,
                        fechafabricacion : detalle.fechafabricacion,
                        fechaexpiracion : detalle.fechaexpiracion,
                        codigobienes : detalle.codigobienes,
                        subtotal: subtotalCalculado,
                        tasaisc : detalle.tasaisc,
                        detventa : detalle.detventa,
                        fechaActualizacion: fechasistema
                    }
                }, { returnDocument: 'after' } )
            } else {
                await FacturaDetalle.create({
                    nofactura: nofacturaUpper,
                    codproducto: detalle.codproducto,
                    descripcion: detalle.descripcion,
                    cantidad: Math.max(1, detalle.cantidad || 1),
                    precio: Math.max(0, detalle.precio || 0),
                    descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
                     impuesto: detalle.impuesto || 0,
                        impuesto1: detalle.impuesto1 || 0,
                        impuesto2: detalle.impuesto2 || 0,
                        impuesto3: detalle.impuesto3 || 0,
                        pormayor: detalle.pormayor || 0,
                         unidad: detalle.unidad || 'UNIDAD',
                        modelo : detalle.modelo,
                        fechafabricacion : detalle.fechafabricacion,
                        fechaexpiracion : detalle.fechaexpiracion,
                        codigobienes : detalle.codigobienes,
                    subtotal: subtotalCalculado,
                    tasaisc : detalle.tasaisc,
                    detventa : detalle.detventa,
                    fechaCreacion: fechasistema
                });
            }
        }
      
         const headActualizada = await FacturaHead.findById(headFinal._id);
        const detallesFinales = await FacturaDetalle.find({ 
            nofactura: nofacturaUpper
        });
        
        // 🔹 DESCONTAR INVENTARIO (CANTIDAD DE DETALLES FINALES)
        for (const det of detallesFinales) {
            if (det.codproducto) {
                const inventario = await Inventariosede.findOne({ idinventario: det.codproducto });
                if (inventario) {
                    const cantActual = Number(inventario.cantidispo || 0);
                    const cantDet = Number(det.cantidad || 0);
                    let nuevaCant = cantActual - cantDet;
                    
                    // Si el resultado es menor a cero, se actualiza a cero
                    if (nuevaCant < 0) nuevaCant = 0; 
                    
                    await Inventariosede.findOneAndUpdate(
                        { idinventario: det.codproducto },
                        { $set: { cantidispo: nuevaCant }}
                    ), { returnDocument: 'after' }
                }
            }
        }
 //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
 //              Acumula Ventas del cliente   
 //
 //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  // 🔹 ACUMULAR TOTAL DE VENTAS AL CLIENTE
 const codclienteUpper = headFinal.codcliente;
        
        if (codclienteUpper) {
            // ✅ Add await so errors are caught by the try/catch block
            await recalcularVentasCliente(codclienteUpper);
        }
        
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
// ============================================================================
// 🔹 ENVIAR FACTURA ELECTRÓNICA A FACTTORY CORP (SOAP - CORREGIDO Y FUNCIONAL)
// ============================================================================
app.post('/api/ventas/facturas/enviar-Thefactory/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const nofacturaUpper = nofactura.toUpperCase();

        // 1. OBTENER DATOS DESDE ATLAS DB
        const factura = await FacturaHead.findOne({ nofactura: nofacturaUpper });
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });

        const detalles = await FacturaDetalle.find({ nofactura: nofacturaUpper });
        if (!detalles || detalles.length === 0) return res.status(400).json({ success: false, message: 'La factura no tiene detalles' });

        const empresa = await EmpresaConfig.findOne({});
        if (!empresa) return res.status(400).json({ success: false, message: 'Configuración de empresa no encontrada' });

        const tablaUbicacion = await Ubicacion.find({});

        // 2. PREPARAR VARIABLES (Mapeo desde tu Schema de Mongoose)
        const escapeXml = (unsafe) => {
            if (!unsafe) return '';
            return String(unsafe).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        };

        const wkimptocontrol = factura.impuesto || 0;
        const fechaEmision = factura.fechaEmision;
        const fechaSalida =  factura.fechaSalida;

        let fenaturalezaop = factura.naturalezaoperacion || '01';
        let fetipodocumento = factura.tipodocumento || '01';
        let fetipoventa = factura.tipoventa || '1';
        let fetipoclientefe = factura.tipoclientefe || '01';
        let fetipocontribuyente = factura.tipocontribuyente || '1';
        
        let ferucprt = factura.ruccliente || '';
        let fedigiverificaprt = factura.digitoverificadoruc || '';
        let ferazonsocialprt = factura.razonsocial || '';
        let fedireccionprt = factura.direccioncontribuyente || '';
        let feemailprt = factura.correocliefe || '';
        
        // Reemplazo de variable global gcorreo2
        if (empresa.emailempresa && empresa.emailempresa !== "00") feemailprt = empresa.emailempresa;
        let fenundocfiscal = factura.nofactura;
        var fetiempopago = "";
        var condicionventatmp = factura.condiciones; 
        if (condicionventatmp !== null){
         fetiempopago = condicionventatmp;
        }
        var feubicacion = "8-8-6"; var feprovincia = "PANAMA"; var fedistrito = "PANAMA"; var fecorregimiento = "BETHANIA";
        if (fetipoclientefe === "03") {
            feubicacion = factura.ubicacionid || feubicacion;
            const ubi = tablaUbicacion.find(u => u.ubicacionid === feubicacion);
            if (ubi) { feprovincia = ubi.provincia; fedistrito = ubi.distrito; fecorregimiento = ubi.corregimiento; }
        }

        let fesucursalemisor = empresa.codigosucemisor || "001";
        let fetokenempresa = (empresa.tokenempresa || "").trim();
        let fetokenclave = (empresa.tokenclave || "").trim();

        // 3. CONSTRUIR XML SOAP (Sintaxis XML corregida)
        let xmlniv1 = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ser="http://schemas.datacontract.org/2004/07/Services.ObjComprobante.v1_0">
<soapenv:Header/><soapenv:Body><tem:Enviar>
<tem:tokenEmpresa>${fetokenempresa}</tem:tokenEmpresa>
<tem:tokenPassword>${fetokenclave}</tem:tokenPassword>
<tem:documento>
<ser:codigoSucursalEmisor>${fesucursalemisor}</ser:codigoSucursalEmisor><ser:tipoSucursal>1</ser:tipoSucursal>
<ser:datosTransaccion>
<ser:tipoEmision>01</ser:tipoEmision><ser:tipoDocumento>${fetipodocumento}</ser:tipoDocumento>
<ser:numeroDocumentoFiscal>${fenundocfiscal}</ser:numeroDocumentoFiscal><ser:puntoFacturacionFiscal>001</ser:puntoFacturacionFiscal>
<ser:fechaEmision>${fechaEmision}</ser:fechaEmision><ser:fechaSalida>${fechaSalida}</ser:fechaSalida>
<ser:naturalezaOperacion>${fenaturalezaop}</ser:naturalezaOperacion><ser:tipoOperacion>1</ser:tipoOperacion>
<ser:destinoOperacion>1</ser:destinoOperacion><ser:formatoCAFE>1</ser:formatoCAFE>
<ser:entregaCAFE>1</ser:entregaCAFE><ser:envioContenedor>1</ser:envioContenedor>
<ser:procesoGeneracion>1</ser:procesoGeneracion><ser:tipoVenta>${fetipoventa}</ser:tipoVenta>
<ser:informacionInteres>Informacion Interes</ser:informacionInteres>
<ser:cliente>
<ser:tipoClienteFE>${fetipoclientefe}</ser:tipoClienteFE><ser:tipoContribuyente>${fetipocontribuyente}</ser:tipoContribuyente>
<ser:numeroRUC>${ferucprt}</ser:numeroRUC><ser:digitoVerificadorRUC>${fedigiverificaprt}</ser:digitoVerificadorRUC>
<ser:razonSocial>${escapeXml(ferazonsocialprt)}</ser:razonSocial><ser:direccion>${escapeXml(fedireccionprt)}</ser:direccion>
<ser:codigoUbicacion>${feubicacion}</ser:codigoUbicacion><ser:provincia>${feprovincia}</ser:provincia>
<ser:distrito>${fedistrito}</ser:distrito><ser:corregimiento>${fecorregimiento}</ser:corregimiento>
<ser:correoElectronico1>${feemailprt}</ser:correoElectronico1><ser:pais>PA</ser:pais>
</ser:cliente></ser:datosTransaccion>`;

        let xmlistseg = "\n<ser:listaItems>\n";
        let xmlenviarlist = "";
        let wtotalprecioneto = 0, wtotalitbms = 0, wtotalisc = 0, wtotaldescuento = 0, wtotaldefactura = 0;

        for (let det of detalles) {
            let wfechafabricafinal = det.fechafabricacion?.length > 5 ? det.fechafabricacion : new Date().toISOString().slice(0, 10);
            let wfechaexpirafinal = det.fechaexpiracion?.length > 5 ? det.fechaexpiracion : new Date().toISOString().slice(0, 10);

            let descpor = parseFloat(det.descuento || 0) / 100;
            let wpreciowk = parseFloat(det.precio || 0);
            let wcantidaditem = parseFloat(det.cantidad || 0);
            let wimpuestoitem = parseFloat(det.impuesto1 || 0) / 100;
            let wtasaisc = parseFloat(det.tasaisc || 0);
            let wcodimpuesto1 = parseFloat(det.impuesto1 || 0);
            let wcodimpuesto2 = parseFloat(det.impuesto2 || 0);
            let wcodimpuesto3 = parseFloat(det.impuesto3 || 0);

            let wtasaitbms = "00";
            if (wcodimpuesto1 !== 0) wtasaitbms = "01";
            if (wcodimpuesto2 !== 0) wtasaitbms = "02";
            if (wcodimpuesto3 !== 0) wtasaitbms = "03";

            let wvalordesc = 0; let wprecioitem = wpreciowk * wcantidaditem;
            if (descpor > 0) {
                wvalordesc = wpreciowk * descpor;
                wtotaldescuento += wvalordesc;
                wprecioitem = (wpreciowk - wvalordesc) * wcantidaditem;
            }
            wtotalprecioneto += wprecioitem;

            let wvalorimpuestoitem = 0;
            if (wtasaitbms === "00" || wtasaitbms === "01") wvalorimpuestoitem = wprecioitem * wimpuestoitem;
            wvalorimpuestoitem = parseFloat(wvalorimpuestoitem.toFixed(2));

            if (parseFloat(wkimptocontrol) === 0) { wtasaitbms = "00"; wvalorimpuestoitem = 0; }
            if (wtasaitbms === "01") wtotalitbms += parseFloat(wvalorimpuestoitem);

            let wtotlinitem = wprecioitem;
            if (wtasaitbms === "01") wtotlinitem += wvalorimpuestoitem;

            let wpormayor = parseFloat(det.pormayor || 0);
            if (det.detventa === "1" || det.detventa === 1) wpormayor = 1;
            let wentrega = wpormayor * wcantidaditem;
            wtotaldefactura += wtotlinitem;

            xmlenviarlist += `<ser:item>
<ser:descripcion>${escapeXml(det.descripcion)}  Empaque(${wentrega})</ser:descripcion>
<ser:codigo>${escapeXml(det.codproducto)}</ser:codigo><ser:unidadMedida>und</ser:unidadMedida>
<ser:cantidad>${wcantidaditem.toFixed(2)}</ser:cantidad><ser:fechaFabricacion>${wfechafabricafinal}</ser:fechaFabricacion>
<ser:fechaCaducidad>${wfechaexpirafinal}</ser:fechaCaducidad>\n`;

            if (fetipoclientefe === "03" && det.codigobienes) {
                xmlenviarlist += `<ser:codigoCPBSAbrev>${det.codigobienes.substring(0, 2)}</ser:codigoCPBSAbrev>
<ser:codigoCPBS>${det.codigobienes}</ser:codigoCPBS><ser:unidadMedidaCPBS>und</ser:unidadMedidaCPBS>\n`;
            }

            xmlenviarlist += `<ser:infoItem>modelo : ${escapeXml(det.modelo)}   ${escapeXml(det.acabados)}</ser:infoItem>
<ser:precioUnitario>${wpreciowk.toFixed(2)}</ser:precioUnitario><ser:precioUnitarioDescuento>${wvalordesc.toFixed(2)}</ser:precioUnitarioDescuento>
<ser:precioItem>${wprecioitem.toFixed(2)}</ser:precioItem><ser:valorTotal>${wtotlinitem.toFixed(2)}</ser:valorTotal>\n`;

            let xmlenviartasa = "";
            if (wtasaitbms === "01") {
                let wintermedio = Math.floor(wvalorimpuestoitem).toString();
                let decimalStr = wvalorimpuestoitem.toString().split('.')[1] || '00';
                let winter2 = 9 - wintermedio.length;
                xmlenviartasa = `<ser:tasaITBMS>${wtasaitbms}</ser:tasaITBMS><ser:valorITBMS>${"0".repeat(Math.max(0, winter2)) + wintermedio + "." + decimalStr}</ser:valorITBMS>\n`;
            } else {
                xmlenviartasa = `<ser:tasaITBMS>00</ser:tasaITBMS><ser:valorITBMS>0.00</ser:valorITBMS>\n`;
            }
            xmlenviarlist += xmlenviartasa + `</ser:item>\n`;
        }

        let xmltotal = `<ser:totalesSubTotales>
<ser:totalPrecioNeto>${wtotalprecioneto.toFixed(2)}</ser:totalPrecioNeto>
<ser:totalITBMS>${wtotalitbms.toFixed(2)}</ser:totalITBMS>
<ser:totalMontoGravado>${wtotalitbms.toFixed(2)}</ser:totalMontoGravado>
<ser:totalFactura>${wtotaldefactura.toFixed(2)}</ser:totalFactura><ser:totalValorRecibido>${wtotaldefactura.toFixed(2)}</ser:totalValorRecibido>
<ser:tiempoPago>${fetiempopago}</ser:tiempoPago><ser:nroItems>${detalles.length}</ser:nroItems>
<ser:totalTodosItems>${wtotaldefactura.toFixed(2)}</ser:totalTodosItems>
<ser:listaFormaPago><ser:formaPago><ser:formaPagoFact>${factura.formapago || '01'}</ser:formaPagoFact>
<ser:valorCuotaPagada>${wtotaldefactura.toFixed(2)}</ser:valorCuotaPagada></ser:formaPago></ser:listaFormaPago>\n`;

        let xmlineareten = ""; let montoreten = 0;
        if (factura.retenedor && factura.retenedor !== "0") {
            let tasareten = ["1", "3"].includes(factura.retenedor) ? 100 : (["2", "4", "7"].includes(factura.retenedor) ? 50 : 0);
            montoreten = wtotalitbms * (tasareten / 100);
            xmlineareten = `<ser:retencion><ser:codigoRetencion>${factura.retenedor}</ser:codigoRetencion><ser:montoRetencion>${montoreten.toFixed(2)}</ser:montoRetencion></ser:retencion>\n`;
        }

        let xmltotcierre = `\n</ser:totalesSubTotales></tem:documento></tem:Enviar></soapenv:Body></soapenv:Envelope>`;
        let xmlenviar = xmlniv1 + xmlistseg + xmlenviarlist + `</ser:listaItems>` + xmltotal + xmlineareten + xmltotcierre;

        // 4. EJECUTAR LLAMADA SOAP (CORREGIDO: La promesa ahora resuelve correctamente)
      let soapUrl = 'https://demoemision.thefactoryhka.com.pa/ws/obj/v1.0/Service.svc';
    
    const soapResponse = await fetch(soapUrl, {
        method: 'POST',
        body: xmlenviar,
        headers: {
            'User-Agent': 'NODEJS-FETCH',
            'Content-Type': 'text/xml;charset=utf-8',
            'SOAPAction': 'http://tempuri.org/IService/Enviar'
        }
    });

    if (!soapResponse.ok) throw new Error(`SOAP failed with status ${soapResponse.status}`);

    const bodyXml = await soapResponse.text();
    
    const extractTag = (xml, tag) => {
        const regex = new RegExp(`<a?:${tag}>([\\s\\S]*?)</a?:${tag}>`, 'i');
        const match = xml.match(regex);
        return match ? match[1].trim() : "";
    };

    const resultadoSOAP = {
        cufeHandle: extractTag(bodyXml, "cufe"),
        qrHandle: extractTag(bodyXml, "qr").replace(/amp;/g, ''),
        codigoHandle: extractTag(bodyXml, "codigo"),
        msgHandle: extractTag(bodyXml, "mensaje"),
        fecharecepHandle: extractTag(bodyXml, "fechaRecepcionDGI"),
        protocoloHandle: extractTag(bodyXml, "nroProtocoloAutorizacion")
    };

    // 4. VALIDAR, GUARDAR EN ATLAS DB Y RESPONDER A KOTLIN
    if (resultadoSOAP.codigoHandle === "200") {
        const today = new Date().toISOString().slice(0, 10);
        
        // ✅ GUARDAR CAE, QR Y ESTADO EN MONGODB ATLAS
        const facturaActualizada = await FacturaHead.findByIdAndUpdate(
            factura._id,
            {
                $set: {
                    facturaelectronica: resultadoSOAP.cufeHandle,
                    facturaqr: resultadoSOAP.qrHandle,
                    fechaEmision: today,
                    fechaSalida: today,
                    fechadgiauto: resultadoSOAP.fecharecepHandle,
                    autorizandgi: resultadoSOAP.protocoloHandle,
                    estado: 'A',
                    fechaActualizacion: new Date().toISOString()
                }
            },
            { new: true } // Devuelve el documento ya actualizado
        );
           await descontarFolioPAC();
        // ✅ DEVOLVER LA FACTURA COMPLETA (Kotlin mapeará esto a FacturaHead automáticamente)
        return res.status(200).json({
            success: true,
            message: 'Factura electrónica aceptada por TheFactory',
            data: facturaActualizada 
        });
    }    // Si TheFactory la rechaza
       else {
            // Si TheFactory la rechaza
            await FacturaHead.findByIdAndUpdate(factura._id, { $set: { estado: 'Rechazada' } });
            
            // 🔹 REVERTIR INVENTARIO (Al ser rechazada, no se debe descontar nada)
            for (const det of detalles) {
                if (det.codproducto) {
                    await Inventariosede.findOneAndUpdate(
                        { idinventario: det.codproducto },
                        { $inc: { cantidispo: (det.cantidad || 0) } 
                    } // Sumamos lo que se había restado
                    ),  { returnDocument: 'after' }
                }
            }
            
            return res.status(400).json({
                success: false,
                message: `Rechazada por TheFactory: ${resultadoSOAP.msgHandle}`,
                data: null
            });
        }
    }
 catch (error) {
    console.error('❌ Error enviar-Thefactory:', error);
    return res.status(500).json({ success: false, message: 'Error interno', error: error.message });
}
 
});

app.post('/api/ventas/notascredito/completa', async (req, res) => {
    try {
        const { head, detalles, tipoNota, montoTotal } = req.body;
        const nofacturaUpper = head.nofactura.toUpperCase();
        
        const facturaOriginal = await FacturaHead.findOne({ nofactura: nofacturaUpper });
        if (!facturaOriginal) return res.status(404).json({ success: false, message: 'Factura original no encontrada' });
        if (facturaOriginal.estado === 'E') return res.status(400).json({ success: false, message: 'No se puede aplicar NC a una factura anulada' });
        if (facturaOriginal.estado === 'Rechazada') return res.status(400).json({ success: false, message: 'No se puede aplicar NC a una factura Rechazada ' });
        // ✅ GENERAR NÚMERO SECUENCIAL DE 10 DÍGITOS DESDE EmpresaConfig
const empresa = await EmpresaConfig.findOne({});
if (!empresa) return res.status(400).json({ success: false, message: 'Configuración de empresa no encontrada' });

const countNC = parseInt(empresa.countnotacredito) || 0;
const nocredito = String(countNC).padStart(10, '0');  // ✅ 10 dígitos: "0000000001"

// ✅ INCREMENTAR Y GUARDAR EL CONTADOR INMEDIATAMENTE (evita duplicados)
await EmpresaConfig.findByIdAndUpdate(empresa._id, {
    $set: { countnotacredito: String(countNC + 1) }
});
        
        // Aquí iría la llamada SOAP a TheFactory HKA para Nota de Crédito (tipoDocumento = 02)
        // Por brevedad, simulamos éxito y guardamos en DB. 
        // En producción, usa el XML de Enviar pero con <ser:tipoDocumento>02</ser:tipoDocumento> y <ser:cufeReferenciado>
        
        const cufeSimulado = `CUFE-NC-${Date.now()}`;
        const qrSimulado = `QR-NC-${Date.now()}`;

        const nuevaHead = await NotaCreditoHead.create({
            ...head,
            nocredito: nocredito,
            facturaelectronica: cufeSimulado,
            facturaqr: qrSimulado,
            cufereferenciado: facturaOriginal.facturaelectronica,
            fechacredito: formatLocalYmd(new Date()),
            estado: 'A',
            tipoNota: tipoNota,
            total: tipoNota === '2' ? (montoTotal || 0) : head.total
        });

        if (tipoNota === '1' && detalles && detalles.length > 0) {
            const detallesPreparados = detalles.map(d => ({ ...d, nocredito: nocredito }));
            await NotaCreditoDetalle.insertMany(detallesPreparados);
        }

        res.status(201).json({ success: true, message: 'Nota de Crédito generada exitosamente', data: nuevaHead });
    } catch (error) {
        console.error('❌ Error creando Nota de Crédito:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// ============================================================================
// 🔹 RUTAS: FACTURAS ELECTRÓNICAS
// ============================================================================

// ───────── LISTAR FACTURAS ─────────
app.get('/api/ventas/facturas/head', async (req, res) => {
    try {
        const { nofactura, codcliente } = req.query;
        let filters = { estado: { $ne: " " } };
        if (nofactura) filters.nofactura = { $regex: nofactura, $options: 'i' };
        if (codcliente) filters.codcliente = codcliente;
        const facturas = await FacturaHead.find(filters).sort({ fechafactura: -1, nofactura: -1 }).limit(100);
        res.json({ success: true, message: `${facturas.length} factura(s) encontrada(s)`, data: facturas });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/facturas/head:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// ───────── CREAR CABECERA DE FACTURA ─────────


// ───────── OBTENER FACTURA POR NÚMERO ─────────
app.get('/api/ventas/facturas/head/nro/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const head = await FacturaHead.findOne({
            nofactura: nofactura
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
        const detalles = await FacturaDetalle.find({ nofactura: nofactura}).sort({ codproducto: 1 });
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
        const exists = await FacturaHead.findOne({ nofactura: head.nofactura });
        if (exists) return res.status(409).json({ success: false, message: 'Ya existe una factura con este número' });
        
        const detallefacturaJson = JSON.stringify(detalles.map(d => ({
            codproducto: d.codproducto, descripcion: d.descripcion, cantidad: d.cantidad,
            precio: d.precio, descuento: d.descuento, impuesto: d.impuesto,
            subtotal: (d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100),
            unidad: d.unidad, impuesto: d.impuesto, impuesto1 : d.impuesto1, impuesto2 : d.impuesto2,
             impuesto3 : d.impuesto3, modelo : d.modelo, pormayor : d.pormayor, tasaisc : d.tasaisc,
             codigobienes : d.codigobienes, fechafabricacion : d.fechafabricacion, fechaexpiracion : d.fechaexpiracion
        })));
        
        var fechasistema = formatLocalYmd(new Date());
        const nuevaHead = await FacturaHead.create({
            ...head,
            nofactura: head.nofactura,
            codcliente: head.codcliente,
            nombreclie: head.nombreclie,
            ruccliente: head.ruccliente,
            codvendedor: head.codvendedor,
            tipocontribuyente: head.tipocontribuyente,
            detallefactura: detallefacturaJson,
            estado: 'A',
            fechaCreacion: fechasistema,
            fechaActualizacion: fechasistema,
            subtotal1: 0, impuesto: 0, subtotal2: 0, total: 0
        });
        
        const detallesPreparados = detalles.map(detalle => ({
            ...detalle,
            nofactura: nuevaHead.nofactura,
            codproducto: detalle.codproducto,
            descripcion: detalle.descripcion,
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

// ───────── ANULAR FACTURA ─────────
// ============================================================================
// 🔹 ANULAR FACTURA ELECTRÓNICA (SOAP TheFactory HKA + INVENTARIO)
// ============================================================================
app.post('/api/ventas/facturas/anular/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const { motivo } = req.body;
        const nofacturaUpper = nofactura;

        // 1. OBTENER FACTURA
        const factura = await FacturaHead.findOne({ nofactura: nofacturaUpper });
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });

        // 2. VALIDAR PERIODO DE ANULACIÓN (MÁXIMO 5 DÍAS)
        const fechaFacturaStr = factura.fechafactura;
        if (!fechaFacturaStr) return res.status(400).json({ success: false, message: 'La factura no tiene fecha de emisión' });

        const [year, month, day] = fechaFacturaStr.split('-').map(Number);
        const fechaFacturaDate = new Date(year, month - 1, day);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffInMs = Math.abs(today.getTime() - fechaFacturaDate.getTime());
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'FACTURA VENCIO PERIODO DE ANULACION' 
            });
        }

        // 3. OBTENER DETALLES PARA REVERTIR INVENTARIO
        const detalles = await FacturaDetalle.find({ nofactura: nofacturaUpper });

        // 4. LLAMADA SOAP A THEFACTORY HKA (ANULACIÓN)
        const empresa = await EmpresaConfig.findOne({});
        if (!empresa) return res.status(400).json({ success: false, message: 'Configuración de empresa no encontrada' });

        const hcodigosucursal = empresa.codigosucemisor || "001";
        const htokenempresa = (empresa.tokenempresa || "").trim();
        const htokenclave = (empresa.tokenclave || "").trim();
        const motivoAnulacion = (motivo || "Anulacion de factura").trim();

let xmlanular   = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ser="http://schemas.datacontract.org/2004/07/Services.Model">
        <soapenv:Header/>
        <soapenv:Body>
           <tem:AnulacionDocumento>
              <tem:tokenEmpresa>${htokenempresa}</tem:tokenEmpresa>
              <tem:tokenPassword>${htokenclave}</tem:tokenPassword>
              <tem:motivoAnulacion>Anulacion de Factura</tem:motivoAnulacion>
              <tem:datosDocumento>
                 <ser:codigoSucursalEmisor>${hcodigosucursal}</ser:codigoSucursalEmisor>
                 <ser:numeroDocumentoFiscal>${nofacturaUpper}</ser:numeroDocumentoFiscal>
                 <ser:puntoFacturacionFiscal>001</ser:puntoFacturacionFiscal>
                 <ser:tipoDocumento>01</ser:tipoDocumento>
                 <ser:tipoEmision>01</ser:tipoEmision>
              </tem:datosDocumento>
           </tem:AnulacionDocumento>
        </soapenv:Body>
     </soapenv:Envelope>`;

        const soapUrl = 'https://demoemision.thefactoryhka.com.pa/ws/obj/v1.0/Service.svc';
        const soapResponse = await fetch(soapUrl, {
            method: 'POST',
            body: xmlanular,
            headers: {
                'User-Agent': 'NODEJS-FETCH',
                'Content-Type': 'text/xml;charset=utf-8',
                'SOAPAction': 'http://tempuri.org/IService/AnulacionDocumento'
            }
        });

        if (!soapResponse.ok) throw new Error(`SOAP failed with status ${soapResponse.status}`);
        
        const bodyXml = await soapResponse.text();
        
        const extractTag = (xml, tag) => {
            const regex = new RegExp(`<a?:${tag}>([\\s\\S]*?)</a?:${tag}>`, 'i');
            const match = xml.match(regex);
            return match ? match[1].trim() : "";
        };

        const codigoHandle = extractTag(bodyXml, "codigo");
        const msgHandle = extractTag(bodyXml, "mensaje");

        // 5. VALIDAR RESPUESTA SOAP
        if (codigoHandle === "200") {
            // ÉXITO: Revertir inventario (SUMAR) y actualizar estado
            for (const det of detalles) {
                if (det.codproducto) {
                    await Inventariosede.findOneAndUpdate(
                        { idinventario: det.codproducto },
                        { $inc: { cantidispo: (det.cantidad || 0) }
                     },
                      { returnDocument: 'after' }  // 🔹 CAMBIO: Sumamos en lugar de restar
                    );
                }
            }

            const facturaActualizada = await FacturaHead.findByIdAndUpdate(
                factura._id, 
                { $set: { estado: 'E' } }, 
                { new: true }
            );
             await descontarFolioPAC();
            return res.status(200).json({
                success: true,
                message: 'Factura anulada exitosamente.',
                data: facturaActualizada
            });
        } else {
             // ❌ FALLO SOAP: No tocar inventario, devolver error detallado
                     const faultCode = extractTag(bodyXml, "faultcode") || extractTag(bodyXml, "Code");
             const faultString = extractTag(bodyXml, "faultstring") || extractTag(bodyXml, "Reason") || extractTag(bodyXml, "Text");

             const finalCode = codigoHandle || faultCode || 'SIN_CODIGO';
             const finalMessage = msgHandle || faultString || 'Error desconocido. Revisa la consola de Node.js para ver el XML crudo.';

             console.error(`🔴 ERROR SOAP TheFactory [${finalCode}]: ${finalMessage}`);

             return res.status(400).json({
                 success: false,
                 message: `Rechazada por TheFactory [${finalCode}]: ${finalMessage}`,
                 data: null,
                 rawXml: bodyXml // Enviamos el XML crudo al frontend (Kotlin) para debug
             });
        }

    } catch (error) {
        console.error('❌ Error anular factura electrónica:', error);
        res.status(500).json({ success: false, message: 'Error interno al anular factura', error: error.message });
    }
});

// ============================================================================
// 🔹 ENVIAR NOTA DE CRÉDITO A THEFACTORY CORP (SOAP)
// 🔹 tipodocumento: "04" = Transacción, "06" = Monto
// ============================================================================
app.post('/api/ventas/notascredito/enviar-Thefactory/:nofactura', async (req, res) => {
try {
const { nofactura } = req.params;
const { tipoNota, motivo, detalles, montoTotal } = req.body;
const nofacturaUpper = nofactura;
    // 1. OBTENER FACTURA ORIGINAL Y VALIDAR
    console.log(`🔍 [Paso 1] Buscando Factura Original Nota credito: "${nofactura}"...`);
const factura = await FacturaHead.findOne({ nofactura: nofacturaUpper });
if (!factura) return res.status(404).json({ success: false, message: 'Factura original no encontrada' });
if (factura.estado === 'E' || factura.estado === 'Rechazada') {
    return res.status(400).json({ success: false, message: 'No se puede aplicar NC a una factura anulada' });
}
if (!factura.facturaelectronica) {
    return res.status(400).json({ 
        success: false, 
        message: "La factura original no tiene CUFE (no fue autorizada). No se puede referenciar." 
    });
}
 console.log(`🔍 [Paso 1] Factura Original Encontrado: "${nofactura}"...`);
const detallesFactura = await FacturaDetalle.find({ nofactura: nofacturaUpper });
if (!detallesFactura || detallesFactura.length === 0) {
    return res.status(400).json({ success: false, message: 'La factura no tiene detalles' });
}
 console.log(`🔍 [Paso 2] Factura Detalle encontrado: "${nofactura}"...`);
// ✅ OBTENER EMPRESA Y GENERAR NÚMERO SECUENCIAL
const empresa = await EmpresaConfig.findOne({});
if (!empresa) return res.status(400).json({ success: false, message: 'Configuración de empresa no encontrada' });

const countNC = parseInt(empresa.countnotacredito) || 0;
const nocredito = String(countNC).padStart(10, '0');  // ✅ 10 dígitos
 console.log(`🔍 [Paso 3] Buscando Empresa Original contador Nota Credito : "${nocredito }"...`);
// ✅ INCREMENTAR CONTADOR INMEDIATAMENTE
await EmpresaConfig.findByIdAndUpdate(empresa._id, {
    $set: { countnotacredito: String(countNC + 1) }
});

const tablaUbicacion = await Ubicacion.find({});
//
//
// 2. GENERAR FECHAS
var fechasistema = formatLocalYmd(new Date());
// ✅ 1. GENERAR FECHA EN FORMATO PANAMÁ ESTRICTO
const fechaEmisiontmp = getPanamaISODate(factura.fechaEmision || new Date());
const fechaSalidatmp = getPanamaISODate(factura.fechaSalida || new Date());

// 1. OBTENER LA FACTURA ORIGINAL REFERENCIADA

// ✅ 2. FORMATEAR ESTRICTAMENTE LA FECHA DE AUTORIZACIÓN DGI
// Al pasar facturaOriginal.fechadgiauto a tu función, garantiza un string limpio YYYY-MM-DDTHH:mm:ss-05:00
const fechaEmisionFacturaRef = getPanamaISODate(factura.fechadgiauto);

console.log("🔍 FECHA EMISIÓN REFERENCIADA (Limpia):", fechaEmisionFacturaRef);
console.log("🔍 TIPO DE DATO:", typeof fechaEmisionFacturaRef); // Debe decir "string"
// ✅ AGREGA ESTE LOG PARA VERIFICAR EL FORMATO EXACTO ANTES DEL SOAP
console.log("🔍 DEBUG FECHA EMISION:", fechaEmisiontmp);
console.log("🔍 DEBUG FECHA SALIDA:", fechaSalidatmp);

// Validación de seguridad: si por alguna razón el formato no es el esperado, lo detectamos aquí
const regexPanamaDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-05:00$/;
if (!regexPanamaDate.test(fechaEmisiontmp)) {
    console.error("❌ EL FORMATO DE FECHA ES INCORRECTO:", fechaEmisiontmp);
}


const fetipodocumento = tipoNota === "1" ? "04" : "06";

     // 3. CREAR REGISTROS EN BD - NOTA CREDITO HEAD
     const detallecreditoJson = JSON.stringify(
         (tipoNota === "1" && detalles && detalles.length > 0 ? detalles : []).map(d => ({
             codproducto: d.codproducto,
             descripcion: d.descripcion,
             cantidad: d.cantidad,
             precio: d.precio,
             descuento: d.descuento,
             unidad: d.unidad,
             impuesto : d.impuesto
         }))
     );
console.log(`🔍 [Paso 4] Creando DetallecreditoJson : ...`);
     const totalNC = tipoNota === "2"
         ? (montoTotal || 0)
         : (detalles || []).reduce((sum, d) => sum + ((d.cantidad || 0) * (d.precio || 0) * (1 - (d.descuento || 0) / 100)), 0);

     const impuestoNC = tipoNota === "2"
         ? ((montoTotal || 0) - ((montoTotal || 0) / 1.07))
         : (detalles || []).reduce((sum, d) => sum + ((d.cantidad || 0) * (d.precio || 0) * (1 - (d.descuento || 0) / 100) * 0.07), 0);
var resultado = totalNC - impuestoNC
     const nuevaNCHead = await NotaCreditoHead.create({
         nocredito: nocredito,
         nofactura: nofacturaUpper,
         nodocumento: nocredito,
         codigosucemisor: factura.codigosucemisor || empresa.codigosucemisor || "001",
         facturaelectronica: '',
         facturaqr: '',
         fechafactura: factura.fechafactura,
         fechacredito: fechasistema,
         fechavencimiento: factura.fechavencimiento,
         fechaEmision: fechaEmisiontmp,
         fechaSalida: fechaSalidatmp,
         tipoclientefe: factura.tipoclientefe,
         codcliente: factura.codcliente,
         idglobalcorpo: factura.idglobalcorporp,
         globalnombre: factura.globalnombre,
         naturalezaoperacion: factura.naturalezaoperacion,
         tipooperacion: factura.tipooperacion,
         destinooperacion: factura.destinooperacion,
         formatocafe: factura.formatocafe,
         entregacafe: factura.entregacafe,
         enviocontenedor: factura.enviocontenedor,
         procesogeneracion: factura.procesogeneracion,
         ruccliente: factura.ruccliente,
         correocliefe: factura.correocliefe,
         digitoverificadoruc: factura.digitoverificadoruc,
         tiposucursal: factura.tiposucursal,
         tipoemision: factura.tipoemision,
         tipodocumento: fetipodocumento,
         puntodefacturacion: factura.puntodefacturacion,
         tipoventa: factura.tipoventa,
         razonsocial: factura.razonsocial,
         direccioncontribuyente: factura.direccioncontribuyente,
         provincia: factura.provincia,
         distrito: factura.distrito,
         corregimiento: factura.corregimiento,
         pais: factura.pais,
         paisotro: factura.paisotro,
         ubicacionid: factura.ubicacionid,
         tipoidclientefe: factura.tipoidclientefe,
         numeroidextranjero: factura.numeroidextranjero,
         paisextranjero: factura.paisextranjero,
         codigoubicacion: factura.codigoubicacion,
         tipoidentificacion: factura.tipoidentificacion,
         identificacionextranjero: factura.identificacionextranjero,
         codicionesentrega: factura.codicionesentrega,
         monedaexportacion: factura.monedaexportacion,
         modenaexportanodef: factura.modenaexportanodef,
         tipodecambio: factura.tipodecambio,
         monedaextranjera: factura.monedaextranjera,
         fechaemisiondocreferenciado: factura.fechafactura,
         cufereferenciado: factura.facturaelectronica || '',
         nrofacturapapel: factura.nrofacturapapel,
         nofacturaimpfiscal: factura.nofacturaimpfiscal,
         tipocontribuyente: factura.tipocontribuyente,
         codvendedor: factura.codvendedor,
         condiciones: factura.condiciones,
         formapago: factura.formapago,
         descuento: factura.descuento,
         subtotal1: totalNC,
         cotiitbms: factura.cotiitbms,
         impuesto: impuestoNC,
         subtotal2: resultado,
         total: totalNC,
         saldo: 0,
         nombreclie: factura.nombreclie,
         asignadoa: "",
         cedulasignadoa:  " ",
         realizado: "  ",
         utilizado: "  ",
         cedulautilizado: "   ",
         fechautilizado: fechasistema,
         facturautilizado: "   ",
         estado: 'A',
         detallecredito: detallecreditoJson,
         tipoNota: tipoNota
     });
console.log(`🔍 [Paso 5] Creando Head de NotaCredito  : ...`);
     // 4. CREAR REGISTROS EN BD - NOTA CREDITO DETALLE
     if (tipoNota === "1" && detalles && detalles.length > 0) {
         const detallesPreparados = detalles.map(d => ({
             nocredito: nocredito,
             fechacredito: fechasistema,
             codcliente: factura.codcliente,
             codvendedor: factura.codvendedor,
             codproducto: d.codproducto,
             cantidad: parseFloat(d.cantidad) || 0,
             descripcion: d.descripcion,
             descuento: parseFloat(d.descuento) || 0,
             impuesto: parseFloat(d.impuesto) || 0,
             impuesto1: parseFloat(d.impuesto1) || 0,
             impuesto2: parseFloat(d.impuesto2) || 0,
             impuesto3: parseFloat(d.impuesto3) || 0,
             codtasaisc: d.codtasaisc || '',
             tasaisc: parseFloat(d.tasaisc) || 0,
             precio: parseFloat(d.precio) || 0,
             fechafabricacion: d.fechafabricacion || fechasistema,
             fechaexpiracion: d.fechaexpiracion || fechasistema,
             codigobienes: d.codigobienes || '',
             codigogtin: parseFloat(d.codigogtin) || 0,
             codigogtininven: parseFloat(d.codigogtininven) || 0,
             cantigtin: parseFloat(d.cantigtin) || 0,
             tasaitbmscod: parseFloat(d.tasaitbmscod) || 0,
             valorisc: parseFloat(d.valorisc) || 0,
             tasaoti: parseFloat(d.tasaoti) || 0,
             valortasaotro: parseFloat(d.valortasaotro) || 0,
             ancho: parseFloat(d.ancho) || 0,
             alto: parseFloat(d.alto) || 0,
             numerolote: d.numerolote || '',
             cantiprodlote: parseFloat(d.cantiprodlote) || 0,
             unidad: d.unidad || 'um',
             mercancia: d.mercancia || '',
             hora: new Date().toLocaleTimeString(),
             acabados: d.acabados || '',
             linea: d.linea || '',
             subtotal: parseFloat(((d.cantidad || 1) * (d.precio || 0) * (1 - (d.descuento || 0) / 100)).toFixed(2))
         }));
         await NotaCreditoDetalle.insertMany(detallesPreparados);
     } else if (tipoNota === "2") {
         await NotaCreditoDetalle.create({
             nocredito: nocredito,
             fechacredito: fechasistema,
             codcliente: factura.codcliente,
             codvendedor: factura.codvendedor,
             codproducto: 'NC-MONTO',
             cantidad: 1,
             descripcion: motivo || 'Nota de Crédito por Monto',
             descuento: 0,
             impuesto: impuestoNC,
             precio: montoTotal || 0,
             unidad: 'um',
             subtotal: montoTotal || 0
         });
     }

     // 5. PREPARAR VARIABLES PARA SOAP
     const escapeXml = (unsafe) => {
         if (!unsafe) return '';
         return String(unsafe).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
     };
console.log(`🔍 [Paso 6] Creando xml para enviar a the factory `);
    
     let fenaturalezaop = factura.naturalezaoperacion || '01';
     let fetipoventa = factura.tipoventa || '1';
     let fetipoclientefe = factura.tipoclientefe || '01';
     let fetipocontribuyente = factura.tipocontribuyente || '1';
     let ferucprt = factura.ruccliente || '';
     let fedigiverificaprt = factura.digitoverificadoruc || '00';
     let ferazonsocialprt = factura.razonsocial || '';
     let fedireccionprt = factura.direccioncontribuyente || 'PANAMA';
     let feemailprt = factura.correocliefe;
     let fefechaemision = factura.fechaemision;
     if (empresa.emailempresa && empresa.emailempresa !== "00") feemailprt = empresa.emailempresa;

     let fenundocfiscal = nocredito;
     var fetiempopago = "";
     var condicionventatmp = factura.condiciones;
     if (condicionventatmp !== null) {
         fetiempopago = condicionventatmp;
     }

     var feubicacion = "8-8-6";
     var feprovincia = "PANAMA";
     var fedistrito = "PANAMA";
     var fecorregimiento = "BETHANIA";

     if (fetipoclientefe === "03") {
         feubicacion = factura.ubicacionid || feubicacion;
         const ubi = tablaUbicacion.find(u => u.ubicacionid === feubicacion);
         if (ubi) {
             feprovincia = ubi.provincia;
             fedistrito = ubi.distrito;
             fecorregimiento = ubi.corregimiento;
         }
     }

     let fesucursalemisor = empresa.codigosucemisor || "0000";
     let fetokenempresa = (empresa.tokenempresa || "").trim();
     let fetokenclave = (empresa.tokenclave || "").trim();
console.log(`🔍 [Paso 7] Asignando la variable xmlnivel 1 de NotaCredito  : ...`);
     // 6. CONSTRUIR XML SOAP
     let xmlniv1 = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ser="http://schemas.datacontract.org/2004/07/Services.ObjComprobante.v1_0">
<soapenv:Header/>
<soapenv:Body>
<tem:Enviar>
<tem:tokenEmpresa>${fetokenempresa}</tem:tokenEmpresa>
<tem:tokenPassword>${fetokenclave}</tem:tokenPassword>
<tem:documento>
<ser:codigoSucursalEmisor>${fesucursalemisor}</ser:codigoSucursalEmisor>
<ser:tipoSucursal>1</ser:tipoSucursal>
<ser:datosTransaccion>
<ser:tipoEmision>01</ser:tipoEmision>
<ser:tipoDocumento>${fetipodocumento}</ser:tipoDocumento>
<ser:numeroDocumentoFiscal>${fenundocfiscal}</ser:numeroDocumentoFiscal>
<ser:puntoFacturacionFiscal>001</ser:puntoFacturacionFiscal>
<ser:fechaEmision>${fechaEmisionFacturaRef}</ser:fechaEmision>
<ser:fechaSalida>${fechaEmisionFacturaRef}</ser:fechaSalida>
<ser:naturalezaOperacion>${fenaturalezaop}</ser:naturalezaOperacion>
<ser:tipoOperacion>1</ser:tipoOperacion>
<ser:destinoOperacion>1</ser:destinoOperacion>
<ser:formatoCAFE>1</ser:formatoCAFE>
<ser:entregaCAFE>1</ser:entregaCAFE>
<ser:envioContenedor>1</ser:envioContenedor>
<ser:procesoGeneracion>1</ser:procesoGeneracion>
<ser:tipoVenta>${fetipoventa}</ser:tipoVenta>
<ser:informacionInteres>Nota de Credito</ser:informacionInteres>
<ser:cliente>
<ser:tipoClienteFE>${fetipoclientefe}</ser:tipoClienteFE>
<ser:tipoContribuyente>${fetipocontribuyente}</ser:tipoContribuyente>
<ser:numeroRUC>${ferucprt}</ser:numeroRUC>
<ser:digitoVerificadorRUC>${fedigiverificaprt}</ser:digitoVerificadorRUC>
<ser:razonSocial>${escapeXml(ferazonsocialprt)}</ser:razonSocial>
<ser:direccion>${escapeXml(fedireccionprt)}</ser:direccion>
<ser:codigoUbicacion>${feubicacion}</ser:codigoUbicacion>
<ser:provincia>${feprovincia}</ser:provincia>
<ser:distrito>${fedistrito}</ser:distrito>
<ser:corregimiento>${fecorregimiento}</ser:corregimiento>
<ser:correoElectronico1>${feemailprt}</ser:correoElectronico1>
<ser:pais>PA</ser:pais>
</ser:cliente>`
 console.log(`🔍 [Paso 8-1] Iniciando la parte de listaItems o sea los detalles  : ...`);
xmlniv1 =  xmlniv1 + "\n" + `
                   <ser:listaDocsFiscalReferenciados>
                   <!--Zero or more repetitions:-->
                   <ser:docFiscalReferenciado>
                      <!--Optional:-->
                      <ser:fechaEmisionDocFiscalReferenciado>${fechaEmisionFacturaRef}</ser:fechaEmisionDocFiscalReferenciado>
                      <!--Optional:-->
                      <ser:cufeFEReferenciada>${factura.facturaelectronica}</ser:cufeFEReferenciada>
                      <!--Optional:-->
                      <ser:nroFacturaPapel></ser:nroFacturaPapel>
                      <!--Optional:-->
                      <ser:nroFacturaImpFiscal></ser:nroFacturaImpFiscal>
                   </ser:docFiscalReferenciado>
                </ser:listaDocsFiscalReferenciados>
            </ser:datosTransaccion>`   
     let xmlistseg = "\n" + `<ser:listaItems>` + "\n";
     let xmlenviarlist = "";
     let wtotalprecioneto = 0, wtotalitbms = 0, wtotalisc = 0, wtotaldescuento = 0, wtotaldefactura = 0;
     let wtotalmontogravado = 0; // ✅ DEFINIDA AQUÍ
     let wtasaitbms = "00";      // ✅ DECLARADA EN SCOPE SUPERIOR
     let codtasaisc = "";         // ✅ DECLARADA EN SCOPE SUPERIOR
console.log(`🔍 [Paso 8-2] Iniciando la parte de listaItems o  por monto  : ...`);
     // Determinar qué items enviar al SOAP
    var wfechafabricafinalesp  =  new Date().toISOString().slice(0, 10);
    var wfechaexpirafinalesp  =  new Date().toISOString().slice(0, 10);
     const itemsParaSoap = tipoNota === "2"
         ? [{
             codproducto: 'NC-MONTO',
             descripcion: motivo || 'Nota de Crédito por Monto',
             cantidad: 1,
             precio: montoTotal || 0,
             descuento: 0,
             impuesto1: factura.impuesto1 || 7,
             impuesto2: factura.impuesto2 || 0,
             impuesto3: factura.impuesto3 || 0,
             unidad: 'um',
             modelo: '',
             acabados: '',
             fechafabricacion: wfechafabricafinalesp,
             fechaexpiracion: wfechaexpirafinalesp,
             codigobienes: '',
             tasaisc: 0,
             pormayor: 1,
             detventa: '1'
         }]
         : (detalles || []);
    

for (let det of itemsParaSoap) {
    let wfechafabricafinal = det.fechafabricacion?.length > 5 ? det.fechafabricacion : wfechafabricafinalesp;
    let wfechaexpirafinal = det.fechaexpiracion?.length > 5 ? det.fechaexpiracion : wfechaexpirafinalesp;
    
    let wkimptocontrol = det.impuesto1 || 0;
    let descpor = parseFloat(det.descuento || 0) / 100;
    let wpreciowk = parseFloat(det.precio);
    let wcantidaditem = parseFloat(det.cantidad);
    
    let wimpuestoitem = parseFloat(det.impuesto1 || 0) / 100;
    let wimpuestoitem2 = parseFloat(det.impuesto2 || 0) / 100;
    let wimpuestoitem3 = parseFloat(det.impuesto3 || 0) / 100;
    
    let wtasaisc = parseFloat(det.tasaisc || 0);
    let wcodimpuesto1 = parseFloat(det.impuesto1 || 0);
    let wcodimpuesto2 = parseFloat(det.impuesto2 || 0);
    let wcodimpuesto3 = parseFloat(det.impuesto3 || 0);
    let codtasaisc = det.codtasaisc;

    let wtasaitbms = "00";
    if (wcodimpuesto1 !== 0) wtasaitbms = "01";
    if (wcodimpuesto2 !== 0) wtasaitbms = "02";
    if (wcodimpuesto3 !== 0) wtasaitbms = "03";

    let wvalordesc = 0;
    let wprecioitem = wpreciowk * wcantidaditem;
    
    if (descpor > 0) {
        wvalordesc = wpreciowk * descpor;
        wtotaldescuento += wvalordesc;
        wprecioitem = (wpreciowk - wvalordesc) * wcantidaditem;
    }
    wtotalprecioneto += wprecioitem;

    // ✅ CORRECCIÓN CRÍTICA: Declarar wtolinitem UNA SOLA VEZ aquí, fuera de los ifs
    let wvalorimpuestoitem = 0;
    let wtolinitem = 0; 

    // Calcular el impuesto según el tipo
    if (wtasaitbms === "00" || wtasaitbms === "01") {
        wvalorimpuestoitem = wprecioitem * wimpuestoitem;
    } else if (wtasaitbms === "02") {
        wvalorimpuestoitem = wprecioitem * wimpuestoitem2;
    } else if (wtasaitbms === "03") {
        wvalorimpuestoitem = wprecioitem * wimpuestoitem3;
    }

    wvalorimpuestoitem = parseFloat(wvalorimpuestoitem.toFixed(2));

    if (parseFloat(wkimptocontrol) === 0) { 
        wtasaitbms = "00"; 
        wvalorimpuestoitem = 0; 
    }

    // Acumular el ITBMS total correctamente
    if (wtasaitbms !== "00") {
        wtotalitbms += wvalorimpuestoitem;
    }

    // ✅ Calcular el total de la línea y acumularlo al total de la factura
    wtolinitem = wprecioitem + wvalorimpuestoitem;
    wtotaldefactura += wtolinitem;

    console.log(`🔍 [Paso 8-3-14] Total acumulado de Factura Nota Credito: "${wtotaldefactura.toFixed(2)}"...`);           

    let wpormayor = parseFloat(det.pormayor || 0);
    if (det.detventa === "1" || det.detventa === 1) wpormayor = 1;
    let wentrega = wpormayor * wcantidaditem;

    // Construcción del XML del item
    xmlenviarlist += `<ser:item>
<ser:descripcion>${det.descripcion}  Empaque(${wentrega})</ser:descripcion>
<ser:codigo>${det.codproducto}</ser:codigo>
<ser:unidadMedida>${det.unidad}</ser:unidadMedida>
<ser:cantidad>${wcantidaditem.toFixed(2)}</ser:cantidad>
<ser:fechaFabricacion>${wfechafabricafinal}</ser:fechaFabricacion>
<ser:fechaCaducidad>${wfechaexpirafinal}</ser:fechaCaducidad>
<ser:precioUnitario>${wpreciowk.toFixed(2)}</ser:precioUnitario>
<ser:precioUnitarioDescuento>${wvalordesc.toFixed(2)}</ser:precioUnitarioDescuento>
<ser:precioItem>${wprecioitem.toFixed(2)}</ser:precioItem>
<ser:valorTotal>${wtolinitem.toFixed(2)}</ser:valorTotal>\n`;

    let xmlenviartasa = "";
    if (wtasaitbms === "01" || wtasaitbms === "02" || wtasaitbms === "03") {
        xmlenviartasa = `<ser:tasaITBMS>${wtasaitbms}</ser:tasaITBMS>\n<ser:valorITBMS>${wvalorimpuestoitem.toFixed(2)}</ser:valorITBMS>\n`;
    } else {
        xmlenviartasa = `<ser:tasaITBMS>00</ser:tasaITBMS>\n<ser:valorITBMS>0.00</ser:valorITBMS>\n`;
    }

    if (codtasaisc === "01" || codtasaisc === "02" || codtasaisc === "03" || codtasaisc === "04" || codtasaisc === "05" || codtasaisc === "06") {
        let wvalorisc = parseFloat(det.valorisc || 0);
        xmlenviartasa += `<ser:tasaISC>${wtasaisc}</ser:tasaISC>\n<ser:valorISC>${wvalorisc.toFixed(2)}</ser:valorISC>\n`;
        // Asegúrate de acumular el ISC total si lo usas más abajo en el XML
        if (typeof wtotalisc !== 'undefined') wtotalisc += wvalorisc;
    }

    xmlenviarlist += xmlenviartasa + `</ser:item>\n`;
}

console.log(`🔍 [Paso 9] Salir de la cracion de detalle de la nota de credito a enviar a TH FACTORY ...`);

console.log(`🔍 [Paso 9-4] Total de factura nota credito  : "${wtotaldefactura}"...`);
if (wtasaitbms == "01" || wtasaitbms == "02" || wtasaitbms == "03"){
  wtotalmontogravado = parseFloat(wtotalmontogravado) + parseFloat(wtotalitbms);
   }
if (codtasaisc == "01" || codtasaisc == "02" || codtasaisc == "03" || codtasaisc == "04" || codtasaisc == "05" || codtasaisc == "06" ){
   wtotalmontogravado = parseFloat(wtotalmontogravado) + parseFloat(wtotalisc);
   }

    let  xmlfinitems =  `</ser:listaItems>`;
//
console.log(`🔍 [Paso 10] Finalizar el comando de definicion de /serListaItems ...`);
var fefechavenceplazo = "x";
var fecuotadepagocre = 0;
var s2x = 0;
if (factura.condiciones != "1"){
    if (factura.condiciones == "2"){
        var myCurrentDate = new Date();
        var myPastDate =  new Date(myCurrentDate);
        var fechanumero = myPastDate.setDate(myPastDate.getDate() + 30);
        var s2x = new Date(fechanumero).toLocaleDateString("en-US");
         let todayvence = dayjs(s2x);
        fefechavenceplazo = todayvence.format();
        fecuotadepagocre = parseFloat(wtotaldefactura).toFixed(2);
    }
    if (factura.condiciones == "3"){
        var myCurrentDate = new Date();
        var myPastDate =  new Date(myCurrentDate);
        var fechanumero = myPastDate.setDate(myPastDate.getDate() + 45);
        var s2x = new Date(fechanumero).toLocaleDateString("en-US");
        let todayvence = dayjs(s2x);
        fefechavenceplazo = todayvence.format();
        fecuotadepagocre = parseFloat(wtotaldefactura).toFixed(2);
    }
    if (factura.condiciones == "4"){
        var myCurrentDate = new Date();
        var myPastDate =  new Date(myCurrentDate);
        var fechanumero = myPastDate.setDate(myPastDate.getDate() + 60);
        var s2x = new Date(fechanumero).toLocaleDateString("en-US");
        let todayvence = dayjs(s2x);
        fefechavenceplazo = todayvence.format();
        fecuotadepagocre = parseFloat(wtotaldefactura).toFixed(2);

    }
    if (factura.condiciones == "5"){
        var myCurrentDate = new Date();
        var myPastDate =  new Date(myCurrentDate);
        var fechanumero = myPastDate.setDate(myPastDate.getDate() + 90);
        var s2x = new Date(fechanumero).toLocaleDateString("en-US");
        let todayvence = dayjs(s2x);
        fefechavenceplazo = todayvence.format();
        fecuotadepagocre = parseFloat(wtotaldefactura).toFixed(2);
    }
 }
//
   console.log(`🔍 [Paso 11-1 ] Tasa ITBMS Nota Credito : "${wtasaitbms}"...`);
   console.log(`🔍 [Paso 11-2 ] TOtal ITBMS Nota Credito : "${wtotalitbms}"...`);
    console.log(`🔍 [Paso 11-3] Total de factura del cliclo : "${wtotaldefactura}"...`);
   
   
   let xmltotal = `<ser:totalesSubTotales>
<ser:totalPrecioNeto>${wtotalprecioneto.toFixed(2)}</ser:totalPrecioNeto>`+ "\n"

if (wtasaitbms == "00" ){
 xmltotal = xmltotal +  `<ser:totalITBMS>` + parseFloat(wtotalitbms).toFixed(2) + `</ser:totalITBMS>`+ "\n"
}

 if (wtasaitbms == "01" || wtasaitbms == "02" || wtasaitbms == "03" ){
                    xmltotal = xmltotal +  `<ser:totalITBMS>` + parseFloat(wtotalitbms).toFixed(2) + `</ser:totalITBMS>`+ "\n"
        }
    if (codtasaisc == "01" || codtasaisc == "02" || codtasaisc == "03" || codtasaisc == "04" || codtasaisc == "05" || codtasaisc == "06" ){
                    xmltotal = xmltotal +  `<ser:totalISC>` + parseFloat(wtotalisc).toFixed(2) + `</ser:totalISC>`+ "\n"
        }
  xmltotal = xmltotal +  `
<ser:totalMontoGravado>${wtotalitbms.toFixed(2)}</ser:totalMontoGravado>
<ser:totalFactura>${wtotaldefactura.toFixed(2)}</ser:totalFactura>
<ser:totalValorRecibido>${wtotaldefactura.toFixed(2)}</ser:totalValorRecibido>
<ser:tiempoPago>${fetiempopago}</ser:tiempoPago>
<ser:nroItems>${itemsParaSoap.length}</ser:nroItems>
<ser:totalTodosItems>${wtotaldefactura.toFixed(2)}</ser:totalTodosItems>
<ser:listaFormaPago><ser:formaPago><ser:formaPagoFact>${factura.formapago || '01'}</ser:formaPagoFact>
<ser:valorCuotaPagada>${wtotaldefactura.toFixed(2)}</ser:valorCuotaPagada></ser:formaPago></ser:listaFormaPago>\n`;

let  xmlplazo =`
                    <ser:listaPagoPlazo>
                                            <!-- Optional -->
                                            <ser:pagoPlazo>
                                               <ser:fechaVenceCuota>` + fefechavenceplazo + `</ser:fechaVenceCuota>
                                               <ser:valorCuota>` + parseFloat(wtotaldefactura).toFixed(2) + `</ser:valorCuota>
                                            </ser:pagoPlazo>
                    </ser:listaPagoPlazo>`

let xmltotcierre = ` </ser:totalesSubTotales>
              </tem:documento>
           </tem:Enviar>
        </soapenv:Body>
        </soapenv:Envelope>
        ` 
console.log(`🔍 [Paso 11] Cierre de los comandos del Soap de enviar la nota de credito a the factory ...`);       
      if (factura.condiciones == "1"){
        var  xmlenviar = xmlniv1 + xmlistseg + xmlenviarlist + xmlfinitems +  xmltotal + xmltotcierre;
     }
     if (factura.condiciones != "1"){
         var  xmlenviar = xmlniv1 + xmlistseg + xmlenviarlist + xmlfinitems +  xmltotal + xmlplazo + xmltotcierre;
      }
     

     // 7. EJECUTAR LLAMADA SOAP
     let soapUrl = 'https://demoemision.thefactoryhka.com.pa/ws/obj/v1.0/Service.svc';
     const soapResponse = await fetch(soapUrl, {
         method: 'POST',
         body: xmlenviar,
         headers: {
             'User-Agent': 'NODEJS-FETCH',
             'Content-Type': 'text/xml;charset=utf-8',
             'SOAPAction': 'http://tempuri.org/IService/Enviar'
         }
     });

     if (!soapResponse.ok) throw new Error(`SOAP failed with status ${soapResponse.status}`);
     const bodyXml = await soapResponse.text();

     const extractTag = (xml, tag) => {
         const regex = new RegExp(`<a?:${tag}>([\\s\\S]*?)</a?:${tag}>`, 'i');
         const match = xml.match(regex);
         return match ? match[1].trim() : "";
     };


     const codigoHandle = extractTag(bodyXml, "codigo");
     const msgHandle = extractTag(bodyXml, "mensaje");

     const resultadoSOAP = {
         cufeHandle: extractTag(bodyXml, "cufe"),
         qrHandle: extractTag(bodyXml, "qr").replace(/amp;/g, ''),
         codigoHandle: extractTag(bodyXml, "codigo"),
         msgHandle: extractTag(bodyXml, "mensaje"),
         fecharecepHandle: extractTag(bodyXml, "fechaRecepcionDGI"),
         protocoloHandle: extractTag(bodyXml, "nroProtocoloAutorizacion")
     };

     // 8. VALIDAR, ACTUALIZAR BD Y RESPONDER
     if (resultadoSOAP.codigoHandle === "200") {
                    const ncActualizada = await NotaCreditoHead.findByIdAndUpdate(
                nuevaNCHead._id,
                {
                    $set: {
                        facturaelectronica: resultadoSOAP.cufeHandle,
                        facturaqr: resultadoSOAP.qrHandle,
                        fechaEmision: fechasistema,
                        fechaSalida: fechasistema,
                        fechadgiauto: resultadoSOAP.fecharecepHandle,
                        autorizandgi: resultadoSOAP.protocoloHandle,
                        estado: 'A',
                        fechaActualizacion: new Date().toISOString()
                    }
                },
                { new: true }
            );
            
            // 🔹 SUMAR INVENTARIO SI ES NOTA DE CRÉDITO POR UNIDADES (tipoNota === "1")
            if (tipoNota === "1" && detalles && detalles.length > 0) {
                for (const det of detalles) {
                    if (det.codproducto) {
                        await Inventariosede.findOneAndUpdate(
                            { idinventario: det.codproducto },
                            { $inc: { cantidispo: (det.cantidad || 0) } },
                         { returnDocument: 'after' } );
                    }
                }
            }

         // Agregar al historial de la factura original
         await FacturaHead.findByIdAndUpdate(factura._id, {
             $addToSet: { historialnotacredito: nocredito }
         });

         await descontarFolioPAC();   // ✅ ← AGREGAR ESTA LÍNEA

         return res.status(200).json({
             success: true,
             message: 'Nota de Crédito aceptada por TheFactory',
             data: ncActualizada
         });
     } else {
         await NotaCreditoHead.findByIdAndUpdate(nuevaNCHead._id, { $set: { estado: 'Rechazada' } });
        
        
        const faultString = extractTag(bodyXml, "faultstring") || extractTag(bodyXml, "Reason") || extractTag(bodyXml, "Text");

             const finalCode = codigoHandle || faultCode || 'SIN_CODIGO';
             const finalMessage = msgHandle || faultString || 'Error desconocido. Revisa la consola de Node.js para ver el XML crudo.';

             console.error(`🔴 ERROR SOAP TheFactory [${finalCode}]: ${finalMessage}`);

             return res.status(400).json({
                 success: false,
                 message: `Rechazada por TheFactory [${finalCode}]: ${finalMessage}`,
                 data: null,
                 rawXml: bodyXml // Enviamos el XML crudo al frontend (Kotlin) para debug
             });
     }

} catch (error) {
     console.error('❌ Error enviar-Thefactory NotaCredito:', error);
     return res.status(500).json({ success: false, message: 'Error interno', error: error.message });
}
});

//%%%%%%%%%%%%%%%%%%%%%%%% NOTA DE CREDITO   %%%%%%%%%%%%%%%%%%%%%%%%%%%//
        app.post('/api/ventas/notascredito/completa', async (req, res) => {
    try {
        const { head, detalles, tipoNota, montoTotal } = req.body;
        const nofacturaUpper = head.nofactura.toUpperCase();
        
        const facturaOriginal = await FacturaHead.findOne({ nofactura: nofacturaUpper });
        if (!facturaOriginal) return res.status(404).json({ success: false, message: 'Factura original no encontrada' });
        if (facturaOriginal.estado === 'E') return res.status(400).json({ success: false, message: 'No se puede aplicar NC a una factura anulada' });

        // ✅ GENERAR NÚMERO SECUENCIAL DE 10 DÍGITOS DESDE EmpresaConfig
const empresa = await EmpresaConfig.findOne({});
if (!empresa) return res.status(400).json({ success: false, message: 'Configuración de empresa no encontrada' });

const countNC = parseInt(empresa.countnotacredito) || 0;
const nocredito = String(countNC).padStart(10, '0');  // ✅ 10 dígitos: "0000000001"

// ✅ INCREMENTAR Y GUARDAR EL CONTADOR INMEDIATAMENTE (evita duplicados)
await EmpresaConfig.findByIdAndUpdate(empresa._id, {
    $set: { countnotacredito: String(countNC + 1) }
});
        
        // Aquí iría la llamada SOAP a TheFactory HKA para Nota de Crédito (tipoDocumento = 02)
        // Por brevedad, simulamos éxito y guardamos en DB. 
        // En producción, usa el XML de Enviar pero con <ser:tipoDocumento>02</ser:tipoDocumento> y <ser:cufeReferenciado>
        
      

        const nuevaHead = await NotaCreditoHead.create({
            ...head,
            nocredito: nocredito,
            facturaelectronica: facturaOriginal.facturaelectronica,
            facturaqr: facturaOriginal.facturaqr,
            cufereferenciado: facturaOriginal.facturaelectronica,
            fechacredito: formatLocalYmd(new Date()),
            estado: 'A',
            tipoNota: tipoNota,
            total: tipoNota === '2' ? (montoTotal || 0) : head.total
        });

        if (tipoNota === '1' && detalles && detalles.length > 0) {
            const detallesPreparados = detalles.map(d => ({ ...d, nocredito: nocredito }));
            await NotaCreditoDetalle.insertMany(detallesPreparados);
        }

        res.status(201).json({ success: true, message: 'Nota de Crédito generada exitosamente', data: nuevaHead });
    } catch (error) {
        console.error('❌ Error creando Nota de Crédito:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// 1. Obtener cantidades ya acreditadas para una factura
app.get('/api/ventas/notascredito/detalle/nro/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const nofacturaUpper = nofactura.toUpperCase();
        
        const creditNotes = await NotaCreditoHead.find({ nofactura: nofacturaUpper, estado: { $ne: 'E' } });
        const nocreditos = creditNotes.map(nc => nc.nocredito);
        
        const detallesCredito = await NotaCreditoDetalle.find({ nocredito: { $in: nocreditos } });
        
        const creditedQuantities = {};
        detallesCredito.forEach(det => {
            const cod = det.codproducto;
            creditedQuantities[cod] = (creditedQuantities[cod] || 0) + (det.cantidad || 0);
        });
        
        res.json({ success: true, data: creditedQuantities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


//=============================================================================
//           NOTADEBITO FACTURA ELECTRONICA 
//=============================================================================
// ============================================================================
// 🔹 OBTENER CANTIDADES YA DEBITADAS PARA UNA FACTURA
// ============================================================================
app.get('/api/ventas/notasdebito/detalle/nro/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const nofacturaUpper = nofactura;

        const debitNotes = await NotaDebitoHead.find({ nofactura: nofacturaUpper, estado: { $ne: 'E' } });
        const nodebitos = debitNotes.map(nd => nd.nodebito);

        const detallesDebito = await NotaDebitoDetalle.find({ nodebito: { $in: nodebitos } });

        const debitedQuantities = {};
        detallesDebito.forEach(det => {
            const cod = det.codproducto;
            debitedQuantities[cod] = (debitedQuantities[cod] || 0) + (det.cantidad || 0);
        });

        res.json({ success: true, data: debitedQuantities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================================
// 🔹 ENVIAR NOTA DE DÉBITO A THEFACTORY CORP (SOAP)
// 🔹 tipodocumento: "05" = Cantidades, "07" = Monto
// ============================================================================
app.post('/api/ventas/notasdebito/enviar-Thefactory/:nofactura', async (req, res) => {
    try {
        const { nofactura } = req.params;
        const { tipoNota, motivo, detalles, montoTotal } = req.body;
        const nofacturaUpper = nofactura;

       // 1. OBTENER FACTURA ORIGINAL Y VALIDAR
       console.log(`🔍 [Paso 1] Buscando Factura Original Nota Debito: "${nofactura}"...`);
const factura = await FacturaHead.findOne({ nofactura: nofacturaUpper });
if (!factura) return res.status(404).json({ success: false, message: 'Factura original no encontrada' });
if (factura.estado === 'E' || factura.estado === 'Anulada') {
    return res.status(400).json({ success: false, message: 'No se puede aplicar ND a una factura anulada' });
}
console.log(`🔍 [Paso 1] Factura Original Encontrado Para NotaDebito  : "${nofactura}"...`);
const detallesFactura = await FacturaDetalle.find({ nofactura: nofacturaUpper });
if (!detallesFactura || detallesFactura.length === 0) {
    return res.status(400).json({ success: false, message: 'La factura no tiene detalles' });
}
console.log(`🔍 [Paso 2] Factura Detalle encontrado: "${nofactura}"...`);
// ✅ OBTENER EMPRESA Y GENERAR NÚMERO SECUENCIAL
const empresa = await EmpresaConfig.findOne({});
if (!empresa) return res.status(400).json({ success: false, message: 'Configuración de empresa no encontrada' });

const countND = parseInt(empresa.countnotadebito) || 0;
const nodebito = String(countND).padStart(10, '0');  // ✅ 10 dígitos
console.log(`🔍 [Paso 3] Buscando Empresa Original contador Nota Credito : "${nodebito }"...`);
// ✅ INCREMENTAR CONTADOR INMEDIATAMENTE
await EmpresaConfig.findByIdAndUpdate(empresa._id, {
    $set: { countnotadebito: String(countND + 1) }
});

const tablaUbicacion = await Ubicacion.find({});

// 2. GENERAR FECHAS
var fechasistema = formatLocalYmd(new Date());
const fechaEmisiontmp = getPanamaISODate(factura.fechaEmision || new Date());
const fechaSalidatmp = getPanamaISODate(factura.fechaSalida || new Date());
console.log("🔍 DEBUG FECHA EMISION:", fechaEmisiontmp);
console.log("🔍 DEBUG FECHA SALIDA:", fechaSalidatmp);
//
const regexPanamaDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-05:00$/;
if (!regexPanamaDate.test(fechaEmisiontmp)) {
    console.error("❌ EL FORMATO DE FECHA ES INCORRECTO:", fechaEmisiontmp);
}




const fetipodocumento = tipoNota === "1" ? "05" : "07";

        // 3. CREAR REGISTROS EN BD - NOTA DEBITO HEAD
        const detalledebitoJson = JSON.stringify(
            (tipoNota === "1" && detalles && detalles.length > 0 ? detalles : []).map(d => ({
                codproducto: d.codproducto,
                descripcion: d.descripcion,
                cantidad: d.cantidad,
                precio: d.precio,
                subtotal: (d.cantidad || 1) * (d.precio || 0),
                unidad: d.unidad
            }))
        );

        const totalND = tipoNota === "2"
            ? (montoTotal || 0)
            : (detalles || []).reduce((sum, d) => sum + ((d.cantidad || 0) * (d.precio || 0)), 0);

        const impuestoND = tipoNota === "2"
            ? ((montoTotal || 0) - ((montoTotal || 0) / 1.07))
            : (detalles || []).reduce((sum, d) => sum + ((d.cantidad || 0) * (d.precio || 0) * 0.07), 0);

        const nuevaNDHead = await NotaDebitoHead.create({
            nodebito: nodebito,
            nofactura: nofacturaUpper,
            nodocumento: nodebito,
            codigosucemisor: factura.codigosucemisor || empresa.codigosucemisor || "0000",
            facturaelectronica: '',
            fechafactura: factura.fechafactura,
            fechadebito: fechasistema,
            fechavencimiento: factura.fechavencimiento,
            fechaEmision: fechasistema,
            fechaSalida: fechasistema,
            formatocafe: factura.formatocafe,
            entregacafe: factura.entregacafe,
            procesogeneracion: factura.procesogeneracion,
            tipocontribuyente: factura.tipocontribuyente,
            tipoventa: factura.tipoventa,
            tiposucursal: factura.tiposucursal,
            tipoclientefe: factura.tipoclientefe,
            razonsocial: factura.razonsocial,
            direccioncontribuyente: factura.direccioncontribuyente,
            globalnombre: factura.globalnombre,
            correocliefe: factura.correocliefe,
            provincia: factura.provincia,
            distrito: factura.distrito,
            corregimiento: factura.corregimiento,
            pais: factura.pais,
            paisotro: factura.paisotro,
            ubicacionid: factura.ubicacionid,
            naturalezaoperacion: factura.naturalezaoperacion,
            tipooperacion: factura.tipooperacion,
            puntodefacturacion: factura.puntodefacturacion,
            tipoidclientefe: factura.tipoidclientefe,
            tipoemision: factura.tipoemision,
            tipodocumento: fetipodocumento,
            codcliente: factura.codcliente,
            estado: 'A',
            idglobalcorpo: factura.idglobalcorporp,
            asignadoa: factura.asignadoa,
            cedulasignadoa: factura.cedulasignadoa,
            realizado: factura.realizado,
            utilizado: factura.utilizado,
            cedulautilizado: factura.cedulautilizado,
            codvendedor: factura.codvendedor,
            condiciones: factura.condiciones,
            formapago: factura.formapago,
            descuento: factura.descuento,
            subtotal1: totalND,
            cotiitbms: factura.cotiitbms,
            impuesto: impuestoND,
            subtotal2: totalND - impuestoND,
            total: totalND,
            saldo: 0,
            coticonvertido: factura.coticonvertido,
            nombreclie: factura.nombreclie,
            ruccliente: factura.ruccliente,
            digitoverificadoruc: factura.digitoverificadoruc,
            detalledebito: detalledebitoJson
        });

        // 4. CREAR REGISTROS EN BD - NOTA DEBITO DETALLE
        if (tipoNota === "1" && detalles && detalles.length > 0) {
            const detallesPreparados = detalles.map(d => ({
                nofactura: nofacturaUpper,
                nodebito: nodebito,
                fechafactura: factura.fechafactura,
                codcliente: factura.codcliente,
                codvendedor: factura.codvendedor,
                codproducto: d.codproducto,
                cantidad: parseFloat(d.cantidad) || 0,
                descripcion: d.descripcion,
                precio: parseFloat(d.precio) || 0,
                ancho: parseFloat(d.ancho) || 0,
                alto: parseFloat(d.alto) || 0,
                unidad: d.unidad || 'UND',
                mercancia: d.mercancia || '',
                hora: new Date().toLocaleTimeString(),
                acabados: d.acabados || ''
            }));
            await NotaDebitoDetalle.insertMany(detallesPreparados);
        } else if (tipoNota === "2") {
            await NotaDebitoDetalle.create({
                nofactura: nofacturaUpper,
                nodebito: nodebito,
                fechafactura: factura.fechafactura,
                codcliente: factura.codcliente,
                codvendedor: factura.codvendedor,
                codproducto: 'ND-MONTO',
                cantidad: 1,
                descripcion: motivo || 'Nota de Débito por Monto',
                precio: montoTotal || 0,
                unidad: 'UND',
                hora: new Date().toLocaleTimeString()
            });
        }

        // 5. PREPARAR VARIABLES PARA SOAP
        const escapeXml = (unsafe) => {
            if (!unsafe) return '';
            return String(unsafe).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        };

        const wkimptocontrol = impuestoND || 0;
        let fenaturalezaop = factura.naturalezaoperacion || '01';
        let fetipoventa = factura.tipoventa || '1';
        let fetipoclientefe = factura.tipoclientefe || '01';
        let fetipocontribuyente = factura.tipocontribuyente || '1';
        let ferucprt = factura.ruccliente || '';
        let fedigiverificaprt = factura.digitoverificadoruc || '00';
        let ferazonsocialprt = factura.razonsocial || '';
        let fedireccionprt = factura.direccioncontribuyente || 'PANAMA';
        let feemailprt = factura.correocliefe;

        if (empresa.emailempresa && empresa.emailempresa !== "00") feemailprt = empresa.emailempresa;

        let fenundocfiscal = nodebito;
        var fetiempopago = "";
        var condicionventatmp = factura.condiciones;
        if (condicionventatmp !== null) {
            fetiempopago = condicionventatmp;
        }

        var feubicacion = "8-8-6";
        var feprovincia = "PANAMA";
        var fedistrito = "PANAMA";
        var fecorregimiento = "BETHANIA";

        if (fetipoclientefe === "03") {
            feubicacion = factura.ubicacionid || feubicacion;
            const ubi = tablaUbicacion.find(u => u.ubicacionid === feubicacion);
            if (ubi) {
                feprovincia = ubi.provincia;
                fedistrito = ubi.distrito;
                fecorregimiento = ubi.corregimiento;
            }
        }

        let fesucursalemisor = empresa.codigosucemisor || "0000";
        let fetokenempresa = (empresa.tokenempresa || "").trim();
        let fetokenclave = (empresa.tokenclave || "").trim();

        // 6. CONSTRUIR XML SOAP
        let xmlniv1 = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ser="http://schemas.datacontract.org/2004/07/Services.ObjComprobante.v1_0">
<soapenv:Header/>
<soapenv:Body>
<tem:Enviar>
<tem:tokenEmpresa>${fetokenempresa}</tem:tokenEmpresa>
<tem:tokenPassword>${fetokenclave}</tem:tokenPassword>
<tem:documento>
<ser:codigoSucursalEmisor>${fesucursalemisor}</ser:codigoSucursalEmisor>
<ser:tipoSucursal>1</ser:tipoSucursal>
<ser:datosTransaccion>
<ser:tipoEmision>01</ser:tipoEmision>
<ser:tipoDocumento>${fetipodocumento}</ser:tipoDocumento>
<ser:numeroDocumentoFiscal>${fenundocfiscal}</ser:numeroDocumentoFiscal>
<ser:puntoFacturacionFiscal>001</ser:puntoFacturacionFiscal>
<ser:fechaEmision>${fechasistema}</ser:fechaEmision>
<ser:fechaSalida>${fechasistema}</ser:fechaSalida>
<ser:naturalezaOperacion>${fenaturalezaop}</ser:naturalezaOperacion>
<ser:tipoOperacion>1</ser:tipoOperacion>
<ser:destinoOperacion>1</ser:destinoOperacion>
<ser:formatoCAFE>1</ser:formatoCAFE>
<ser:entregaCAFE>1</ser:entregaCAFE>
<ser:envioContenedor>1</ser:envioContenedor>
<ser:procesoGeneracion>1</ser:procesoGeneracion>
<ser:tipoVenta>${fetipoventa}</ser:tipoVenta>
<ser:informacionInteres>${escapeXml(motivo || 'Nota de Debito')}</ser:informacionInteres>
<ser:cufeReferenciado>${factura.facturaelectronica || ''}</ser:cufeReferenciado>
<ser:cliente>
<ser:tipoClienteFE>${fetipoclientefe}</ser:tipoClienteFE>
<ser:tipoContribuyente>${fetipocontribuyente}</ser:tipoContribuyente>
<ser:numeroRUC>${ferucprt}</ser:numeroRUC>
<ser:digitoVerificadorRUC>${fedigiverificaprt}</ser:digitoVerificadorRUC>
<ser:razonSocial>${escapeXml(ferazonsocialprt)}</ser:razonSocial>
<ser:direccion>${escapeXml(fedireccionprt)}</ser:direccion>
<ser:codigoUbicacion>${feubicacion}</ser:codigoUbicacion>
<ser:provincia>${feprovincia}</ser:provincia>
<ser:distrito>${fedistrito}</ser:distrito>
<ser:corregimiento>${fecorregimiento}</ser:corregimiento>
<ser:correoElectronico1>${feemailprt}</ser:correoElectronico1>
<ser:pais>PA</ser:pais>
</ser:cliente>
</ser:datosTransaccion>`;

        let xmlistseg = "\n<ser:listaItems>\n";
        let xmlenviarlist = "";
        let wtotalprecioneto = 0, wtotalitbms = 0, wtotaldescuento = 0, wtotaldefactura = 0;

        const itemsParaSoap = tipoNota === "2"
            ? [{
                codproducto: 'ND-MONTO',
                descripcion: motivo || 'Nota de Débito por Monto',
                cantidad: 1,
                precio: montoTotal || 0,
                descuento: 0,
                impuesto1: factura.impuesto1 || 7,
                impuesto2: factura.impuesto2 || 0,
                impuesto3: factura.impuesto3 || 0,
                unidad: 'UND',
                modelo: '',
                acabados: '',
                fechafabricacion: fechasistema,
                fechaexpiracion: fechasistema,
                codigobienes: '',
                tasaisc: 0,
                pormayor: 1,
                detventa: '1'
            }]
            : (detalles || []).map(d => ({
                codproducto: d.codproducto,
                descripcion: d.descripcion,
                cantidad: d.cantidad,
                precio: d.precio,
                descuento: 0,
                impuesto1: factura.impuesto1 || 7,
                impuesto2: factura.impuesto2 || 0,
                impuesto3: factura.impuesto3 || 0,
                unidad: d.unidad || 'UND',
                modelo: '',
                acabados: '',
                fechafabricacion: fechasistema,
                fechaexpiracion: fechasistema,
                codigobienes: '',
                tasaisc: 0,
                pormayor: 1,
                detventa: '1'
            }));

        for (let det of itemsParaSoap) {
            let wfechafabricafinal = det.fechafabricacion?.length > 5 ? det.fechafabricacion : fechasistema;
            let wfechaexpirafinal = det.fechaexpiracion?.length > 5 ? det.fechaexpiracion : fechasistema;
            let descpor = parseFloat(det.descuento || 0) / 100;
            let wpreciowk = parseFloat(det.precio || 0);
            let wcantidaditem = parseFloat(det.cantidad || 0);
            let wimpuestoitem = parseFloat(det.impuesto1 || 0) / 100;
            let wcodimpuesto1 = parseFloat(det.impuesto1 || 0);
            let wcodimpuesto2 = parseFloat(det.impuesto2 || 0);
            let wcodimpuesto3 = parseFloat(det.impuesto3 || 0);

            let wtasaitbms = "00";
            if (wcodimpuesto1 !== 0) wtasaitbms = "01";
            if (wcodimpuesto2 !== 0) wtasaitbms = "02";
            if (wcodimpuesto3 !== 0) wtasaitbms = "03";

            let wvalordesc = 0;
            let wprecioitem = wpreciowk * wcantidaditem;
            if (descpor > 0) {
                wvalordesc = wpreciowk * descpor;
                wtotaldescuento += wvalordesc;
                wprecioitem = (wpreciowk - wvalordesc) * wcantidaditem;
            }
            wtotalprecioneto += wprecioitem;

            let wvalorimpuestoitem = 0;
            if (wtasaitbms === "00" || wtasaitbms === "01") wvalorimpuestoitem = wprecioitem * wimpuestoitem;
            wvalorimpuestoitem = parseFloat(wvalorimpuestoitem.toFixed(2));
            if (parseFloat(wkimptocontrol) === 0) { wtasaitbms = "00"; wvalorimpuestoitem = 0; }
            if (wtasaitbms === "01") wtotalitbms += parseFloat(wvalorimpuestoitem);

            let wtotlinitem = wprecioitem;
            if (wtasaitbms === "01") wtotlinitem += wvalorimpuestoitem;

            let wpormayor = parseFloat(det.pormayor || 0);
            if (det.detventa === "1" || det.detventa === 1) wpormayor = 1;
            let wentrega = wpormayor * wcantidaditem;
            wtotaldefactura += wtotlinitem;

            xmlenviarlist += `<ser:item>
<ser:descripcion>${escapeXml(det.descripcion)}  Empaque(${wentrega})</ser:descripcion>
<ser:codigo>${escapeXml(det.codproducto)}</ser:codigo>
<ser:unidadMedida>${det.unidad || 'und'}</ser:unidadMedida>
<ser:cantidad>${wcantidaditem.toFixed(2)}</ser:cantidad>
<ser:fechaFabricacion>${wfechafabricafinal}</ser:fechaFabricacion>
<ser:fechaCaducidad>${wfechaexpirafinal}</ser:fechaCaducidad>\n`;

            if (fetipoclientefe === "03" && det.codigobienes) {
                xmlenviarlist += `<ser:codigoCPBSAbrev>${det.codigobienes.substring(0, 2)}</ser:codigoCPBSAbrev>
<ser:codigoCPBS>${det.codigobienes}</ser:codigoCPBS>
<ser:unidadMedidaCPBS>und</ser:unidadMedidaCPBS>\n`;
            }

            xmlenviarlist += `<ser:infoItem>modelo : ${escapeXml(det.modelo || '')}   ${escapeXml(det.acabados || '')}</ser:infoItem>
<ser:precioUnitario>${wpreciowk.toFixed(2)}</ser:precioUnitario>
<ser:precioUnitarioDescuento>${wvalordesc.toFixed(2)}</ser:precioUnitarioDescuento>
<ser:precioItem>${wprecioitem.toFixed(2)}</ser:precioItem>
<ser:valorTotal>${wtotlinitem.toFixed(2)}</ser:valorTotal>\n`;

            let xmlenviartasa = "";
            if (wtasaitbms === "01") {
                let wintermedio = Math.floor(wvalorimpuestoitem).toString();
                let decimalStr = wvalorimpuestoitem.toString().split('.')[1] || '00';
                let winter2 = 9 - wintermedio.length;
                xmlenviartasa = `<ser:tasaITBMS>${wtasaitbms}</ser:tasaITBMS><ser:valorITBMS>${"0".repeat(Math.max(0, winter2)) + wintermedio + "." + decimalStr}</ser:valorITBMS>\n`;
            } else {
                xmlenviartasa = `<ser:tasaITBMS>00</ser:tasaITBMS><ser:valorITBMS>0.00</ser:valorITBMS>\n`;
            }
            xmlenviarlist += xmlenviartasa + `</ser:item>\n`;
        }

        let xmltotal = `<ser:totalesSubTotales>
<ser:totalPrecioNeto>${wtotalprecioneto.toFixed(2)}</ser:totalPrecioNeto>
<ser:totalITBMS>${wtotalitbms.toFixed(2)}</ser:totalITBMS>
<ser:totalMontoGravado>${wtotalitbms.toFixed(2)}</ser:totalMontoGravado>
<ser:totalFactura>${wtotaldefactura.toFixed(2)}</ser:totalFactura>
<ser:totalValorRecibido>${wtotaldefactura.toFixed(2)}</ser:totalValorRecibido>
<ser:tiempoPago>${fetiempopago}</ser:tiempoPago>
<ser:nroItems>${itemsParaSoap.length}</ser:nroItems>
<ser:totalTodosItems>${wtotaldefactura.toFixed(2)}</ser:totalTodosItems>
<ser:listaFormaPago><ser:formaPago><ser:formaPagoFact>${factura.formapago || '01'}</ser:formaPagoFact>
<ser:valorCuotaPagada>${wtotaldefactura.toFixed(2)}</ser:valorCuotaPagada></ser:formaPago></ser:listaFormaPago>\n`;

        let xmlineareten = "";
        let montoreten = 0;
        if (factura.retenedor && factura.retenedor !== "0") {
            let tasareten = ["1", "3"].includes(factura.retenedor) ? 100 : (["2", "4", "7"].includes(factura.retenedor) ? 50 : 0);
            montoreten = wtotalitbms * (tasareten / 100);
            xmlineareten = `<ser:retencion><ser:codigoRetencion>${factura.retenedor}</ser:codigoRetencion><ser:montoRetencion>${montoreten.toFixed(2)}</ser:montoRetencion></ser:retencion>\n`;
        }

        let xmltotcierre = `\n</ser:totalesSubTotales></tem:documento></tem:Enviar></soapenv:Body></soapenv:Envelope>`;
        let xmlenviar = xmlniv1 + xmlistseg + xmlenviarlist + `</ser:listaItems>` + xmltotal + xmlineareten + xmltotcierre;

        // 7. EJECUTAR LLAMADA SOAP
        let soapUrl = 'https://demoemision.thefactoryhka.com.pa/ws/obj/v1.0/Service.svc';
        const soapResponse = await fetch(soapUrl, {
            method: 'POST',
            body: xmlenviar,
            headers: {
                'User-Agent': 'NODEJS-FETCH',
                'Content-Type': 'text/xml;charset=utf-8',
                'SOAPAction': 'http://tempuri.org/IService/Enviar'
            }
        });

        if (!soapResponse.ok) throw new Error(`SOAP failed with status ${soapResponse.status}`);
        const bodyXml = await soapResponse.text();

        const extractTag = (xml, tag) => {
            const regex = new RegExp(`<a?:${tag}>([\\s\\S]*?)</a?:${tag}>`, 'i');
            const match = xml.match(regex);
            return match ? match[1].trim() : "";
        };

        const resultadoSOAP = {
            cufeHandle: extractTag(bodyXml, "cufe"),
            qrHandle: extractTag(bodyXml, "qr").replace(/amp;/g, ''),
            codigoHandle: extractTag(bodyXml, "codigo"),
            msgHandle: extractTag(bodyXml, "mensaje"),
            fecharecepHandle: extractTag(bodyXml, "fechaRecepcionDGI"),
            protocoloHandle: extractTag(bodyXml, "nroProtocoloAutorizacion")
        };

        // 8. VALIDAR, ACTUALIZAR BD Y RESPONDER
        if (resultadoSOAP.codigoHandle === "200") {
            // ✅ SUMAR CANTIDAD AL INVENTARIO (solo para ND por cantidades)
            if (tipoNota === "1" && detalles && detalles.length > 0) {
                for (const det of detalles) {
                    if (det.codproducto) {
                        await Inventariosede.findOneAndUpdate(
                            { idinventario: det.codproducto },
                            { $inc: { cantidispo: Math.abs(det.cantidad || 0) } },
                             { returnDocument: 'after' } 
                        );
                    }
                }
            }

            const ndActualizada = await NotaDebitoHead.findByIdAndUpdate(
                nuevaNDHead._id,
                {
                    $set: {
                        facturaelectronica: resultadoSOAP.cufeHandle,
                        fechaEmision: fechasistema,
                        fechaSalida: fechasistema,
                        estado: 'A',
                        fechaActualizacion: new Date().toISOString()
                    }
                },
                { new: true }
            );

            // Agregar al historial de la factura original
            await FacturaHead.findByIdAndUpdate(factura._id, {
                $addToSet: { historialnotadebito: nodebito }
            });

            // ✅ DESCONTAR FOLIO PAC
            await descontarFolioPAC();

            return res.status(200).json({
                success: true,
                message: 'Nota de Débito aceptada por TheFactory',
                data: ndActualizada
            });
        } else {
            await NotaDebitoHead.findByIdAndUpdate(nuevaNDHead._id, { $set: { estado: 'Rechazada' } });
            return res.status(400).json({
                success: false,
                message: `Rechazada por TheFactory: ${resultadoSOAP.msgHandle}`,
                data: null
            });
        }
    } catch (error) {
        console.error('❌ Error enviar-Thefactory NotaDebito:', error);
        return res.status(500).json({ success: false, message: 'Error interno', error: error.message });
    }
});

// ============================================================================
// 🔹 RUTAS: GASTOS MAESTROS (HEAD)
// ============================================================================
app.get('/api/compras/gastos/head', async (req, res) => {
    try {
        const gastos = await GastoHead.find({}).sort({ codigogasto: 1 });
        res.json({ success: true, message: `${gastos.length} gasto(s) encontrado(s)`, data: gastos });
    } catch (error) {
        console.error('❌ Error GET /api/compras/gastos/head:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

app.post('/api/compras/gastos/head', async (req, res) => {
    try {
        const { codigogasto, nombregasto, acumgasto } = req.body;
        
        // ✅ Validar que el código tenga exactamente 6 dígitos numéricos
        if (!codigogasto?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'El código de gasto es obligatorio' 
            });
        }
        
        // ✅ Validar formato: exactamente 6 dígitos numéricos
        const codigoRegex = /^\d{6}$/;
        if (!codigoRegex.test(codigogasto.trim())) {
            return res.status(400).json({ 
                success: false, 
                message: 'El código de gasto debe tener exactamente 6 dígitos numéricos (ejemplo: 616391)' 
            });
        }
        
        if (!nombregasto?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'El nombre del gasto es obligatorio' 
            });
        }
        
        // ✅ Normalizar el código (ya tiene 6 dígitos, no necesita uppercase)
        const codigoFinal = codigogasto.trim();
        
        // ✅ Verificar duplicados
        const exists = await GastoHead.findOne({ codigogasto: codigoFinal });
        if (exists) {
            return res.status(409).json({ 
                success: false, 
                message: `Ya existe un gasto con el código: ${codigoFinal}` 
            });
        }

        // ✅ Crear el gasto
        const nuevoGasto = await GastoHead.create({
            codigogasto: codigoFinal,
            nombregasto: nombregasto.trim().toUpperCase(),
            acumgasto: parseFloat(acumgasto) || 0
        });
        
        res.status(201).json({ 
            success: true, 
            message: '✅ Gasto creado', 
            data: nuevoGasto 
        });
    } catch (error) {
        console.error('❌ Error POST /api/compras/gastos/head:', error);
        
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: 'El código ya existe' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear gasto', 
            error: error.message 
        });
    }
});
//============================================================================//
// ============================================================================
// 🔹 RUTAS: CARGA MASIVA DE GASTOS MAESTROS
// ============================================================================

app.post('/api/compras/gastos/head/bulk', async (req, res) => {
    try {
        console.log('📥 Recibiendo carga masiva. Tipo de dato:', Array.isArray(req.body) ? 'Array' : typeof req.body);
        
        const gastosArray = req.body;
        if (!Array.isArray(gastosArray)) {
            return res.status(400).json({ success: false, message: 'Se requiere un array de gastos en el body' });
        }

        // ✅ 1. Obtener códigos existentes UNA SOLA VEZ para máxima velocidad
        const existingGastos = await GastoHead.find({}, 'codigogasto');
        const existingCodes = new Set(existingGastos.map(g => g.codigogasto));

        const documentosValidos = [];
        let duplicateCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const gastoData of gastosArray) {
            try {
                const { codigogasto, nombregasto } = gastoData;
                if (!codigogasto || !nombregasto) {
                    errorCount++;
                    errors.push('Registro sin codigogasto o nombregasto');
                    continue;
                }
                
                const codigoUpper = codigogasto.toString().trim().toUpperCase();
                if (existingCodes.has(codigoUpper)) {
                    duplicateCount++;
                    continue;
                }

                documentosValidos.push({
                    codigogasto: codigoUpper,
                    nombregasto: nombregasto.toString().trim().toUpperCase(),
                    acumgasto: 0
                });
                existingCodes.add(codigoUpper);
            } catch (err) {
                errorCount++;
                errors.push(`Error procesando registro: ${err.message}`);
            }
        }

        // ✅ 2. INSERTAR TODOS DE UNA VEZ con insertMany (Mucho más rápido)
        let successCount = 0;
        if (documentosValidos.length > 0) {
            try {
                const result = await GastoHead.insertMany(documentosValidos, { 
                    ordered: false,  // ✅ Continúa insertando aunque haya errores de duplicado
                    rawResult: true 
                });
                successCount = result.insertedCount || documentosValidos.length;
            } catch (err) {
                if (err.insertedDocs && err.insertedDocs.length > 0) {
                    successCount = err.insertedDocs.length;
                }
                console.error('⚠️ Errores parciales en insertMany:', err.message);
                errors.push(`Errores parciales en BD: ${err.message}`);
            }
        }

        // ✅ 3. Responder con el resumen
        res.json({
            success: true,
            message: 'Carga masiva de gastos completada',
            data: {
                total: gastosArray.length,
                success: successCount,
                duplicates: duplicateCount,
                errors: errorCount,
                errorMessages: errors.slice(0, 10) // Limitar a 10 errores para no saturar
            }
        });
    } catch (error) {
        console.error('❌ Error CRÍTICO POST /api/compras/gastos/head/bulk:', error);
        res.status(500).json({ success: false, message: 'Error en carga masiva', error: error.message });
        // Si ves este log en la consola de Node.js, sabremos exactamente qué falló
    }
});

app.put('/api/compras/gastos/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });

        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.codigogasto;

        const actualizado = await GastoHead.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!actualizado) return res.status(404).json({ success: false, message: 'Gasto no encontrado' });

        res.json({ success: true, message: '✅ Gasto actualizado', data: actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/compras/gastos/head:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

app.delete('/api/compras/gastos/head/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });

        const eliminado = await GastoHead.findByIdAndDelete(id);
        if (!eliminado) return res.status(404).json({ success: false, message: 'Gasto no encontrado' });

        res.json({ success: true, message: '🗑️ Gasto eliminado' });
    } catch (error) {
        console.error('❌ Error DELETE /api/compras/gastos/head:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});

// ============================================================================
// 🔹 RUTAS: TRANSACCIONES DE GASTOS
// ============================================================================
// In server.js, update the GET endpoint
app.get('/api/compras/gastos/trans', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal } = req.query;
        console.log(`📥 GET /api/compras/gastos/trans: fechaInicial=${fechaInicial}, fechaFinal=${fechaFinal}`);
        
        let filter = {};

        if (fechaInicial && fechaFinal) {
            filter.fechatran = { $gte: fechaInicial, $lte: fechaFinal };
            console.log(`📅 Filtering by date range: ${fechaInicial} to ${fechaFinal}`);
        } else if (fechaInicial) {
            filter.fechatran = { $gte: fechaInicial };
            console.log(`📅 Filtering from: ${fechaInicial}`);
        } else if (fechaFinal) {
            filter.fechatran = { $lte: fechaFinal };
            console.log(`📅 Filtering to: ${fechaFinal}`);
        } else {
            console.log(`📅 No date filter applied`);
        }

        console.log(`🔍 Final filter: ${JSON.stringify(filter)}`);
        
        const transacciones = await GastoTrans.find(filter).sort({ fechatran: -1, createdAt: -1 });
        
        console.log(`✅ Found ${transacciones.length} transactions`);
        
        if (transacciones.length > 0) {
            console.log(`📋 First transaction: ${JSON.stringify(transacciones[0])}`);
        }
        
        res.json({
            success: true,
            message: `${transacciones.length} transacción(es) encontrada(s)`,
            data: transacciones
        });
    } catch (error) {
        console.error('❌ Error GET /api/compras/gastos/trans:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error del servidor', 
            error: error.message 
        });
    }
});

app.post('/api/compras/gastos/trans', async (req, res) => {
    try {
        const { codigogasto, monto } = req.body;
        
        if (!codigogasto?.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'El código de gasto es obligatorio' 
            });
        }
        
        // ✅ Validar formato: exactamente 6 dígitos numéricos
        const codigoRegex = /^\d{6}$/;
        if (!codigoRegex.test(codigogasto.trim())) {
            return res.status(400).json({ 
                success: false, 
                message: 'El código de gasto debe tener exactamente 6 dígitos numéricos' 
            });
        }

        // ✅ Buscar el gasto maestro (ya está en formato correcto)
        const gastoExiste = await GastoHead.findOne({ codigogasto: codigogasto.trim() });
        
        if (!gastoExiste) {
            return res.status(404).json({ 
                success: false, 
                message: `El código de gasto ${codigogasto} no existe en el maestro` 
            });
        }

        // ✅ Crear la transacción
        const nuevaTrans = await GastoTrans.create({
            ...req.body,
            codigogasto: codigogasto.trim(), // ✅ Ya tiene 6 dígitos
            monto: parseFloat(monto) || 0,
            impuesto: parseFloat(req.body.impuesto) || 0
        });

        // ✅ Actualizar el acumulado del gasto maestro
        await GastoHead.findOneAndUpdate(
            { codigogasto: codigogasto.trim() },
            { $inc: { acumgasto: parseFloat(monto) || 0 } },
             { returnDocument: 'after' } 
        );

        res.status(201).json({ 
            success: true, 
            message: '✅ Transacción creada y acumulado actualizado', 
            data: nuevaTrans 
        });
    } catch (error) {
        console.error('❌ Error POST /api/compras/gastos/trans:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear transacción', 
            error: error.message 
        });
    }
});

app.delete('/api/compras/gastos/trans/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });

        const eliminado = await GastoTrans.findByIdAndDelete(id);
        if (!eliminado) return res.status(404).json({ success: false, message: 'Transacción no encontrada' });

        res.json({ success: true, message: '🗑️ Transacción eliminada' });
    } catch (error) {
        console.error('❌ Error DELETE /api/compras/gastos/trans:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});
//%%%%%%%%%%%%%%%%%%%%%%% COMPRAS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

// ============================================================================
// 🔹 RUTAS: COMPRAS HEAD & DETALLE
// ============================================================================
// POST /api/compras/head
// Esta es la ruta que llama Android al presionar "Continuar"
app.post("/api/compras/head", async (req, res) => {
  try {
    const { nodocumento } = req.body;

    // Validación básica
    if (!nodocumento) {
      return res.status(400).json({ success: false, message: "El número de documento es obligatorio." });
    }

    // Verificar si ya existe
    const existing = await ComprasHead.findOne({ nodocumento });
    if (existing) {
      return res.status(409).json({ success: false, message: "El documento ya existe." });
    }

    // Crear y guardar la cabecera
    const newHead = new ComprasHead(req.body);
    const savedHead = await newHead.save();

    res.status(201).json({
      success: true,
      message: "Cabecera de compra creada exitosamente",
      data: savedHead
    });
  } catch (error) {
    console.error("❌ Error POST /api/compras/head:", error);
    res.status(500).json({ success: false, message: "Error del servidor", error: error.message });
  }
});
// GET: Obtener todas las compras
app.get('/api/compras/head', async (req, res) => {
    try {
        const { nodocumento } = req.query;
        const filter = {};
        if (nodocumento?.trim()) {
            filter.nodocumento = { $regex: nodocumento.trim(), $options: 'i' };
        }
        const compras = await ComprasHead.find(filter).sort({ fechadocumento: -1 });
        res.json({ success: true, message: `${compras.length} compras encontradas`, data: compras });
    } catch (error) {
        console.error('❌ Error GET /api/compras/head:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// POST: Crear compra completa (Head + Detalles + Inventario + CostoDifer)
app.post('/api/compras/completa', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { head, detalles } = req.body;

        if (!head || !head.nodocumento || !head.codproveedor || !detalles || !Array.isArray(detalles) || detalles.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Faltan datos obligatorios en la cabecera o detalle de la compra' });
        }

        const existing = await ComprasHead.findOne({ nodocumento: head.nodocumento }).session(session);
        if (existing) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ success: false, message: 'Ya existe una compra con este número de documento' });
        }

        const detallecompraJson = JSON.stringify(detalles.map(d => ({
            codproducto: d.codproducto,
            descripcion: d.descripcion,
            cantidad: d.cantidad,
            costo: d.costo,
            descuento: d.descuento,
            impuesto: d.impuesto,
            subtotal: (d.cantidad || 1) * (d.costo || 0) * (1 - (d.descuento || 0) / 100),
            unidad: d.unidad
        })));
        
        var fechasistema = formatLocalYmd(new Date());
        var workhora = new Date().toLocaleTimeString();

        // 1. Guardar ComprasHead
        const nuevaCompraHead = await ComprasHead.create([{
            ...head,
            nodocumento: head.nodocumento,
            nofactura: head.nofactura,
            fechadocumento: fechasistema,
            fechafactura: head.fechafactura,
            fechavencimiento: head.fechavencimiento,
            codproveedor: head.codproveedor,
            nombreproveedor: head.nombreproveedor?.trim().toUpperCase() || '',
            rucproveedor: head.rucproveedor,
            tipocompra: head.tipocompra,
            transaccion: head.transaccion?.trim().toUpperCase() || '',
            detallecompra: detallecompraJson,
            estatuscompra: 'A',
            condiciones: head.condiciones,
            formapago: head.formapago,
            subtotal1: 0, descuento: 0, saldo: 0, impuesto: 0, impuesto1: 0, impuesto2: 0, impuesto3: 0, subtotal2: 0, total: 0
        }], { session });

        // 2. Procesar Inventario y CostoDifer
        if (Array.isArray(detalles) && detalles.length > 0) {
            for (const item of detalles) {
                if (item.codproducto) {
                    const itemInventario = await Inventariosede.findOne({ idinventario: item.codproducto }).session(session);
                    
                    if (itemInventario) {
                        const cantActual = Number(itemInventario.cantidispo || 0);
                        const costo1Actual = Number(itemInventario.costo1 || 0);
                        
                        const cantNueva = Number(item.cantidad || 0);
                        const costoNuevo = Number(item.costo1 !== undefined ? item.costo1 : (item.costo || 0));

                        const totalCant = cantActual + cantNueva;

                        let nuevoCostoPromedio = costoNuevo;
                        if (totalCant > 0) {
                            nuevoCostoPromedio = ((cantActual * costo1Actual) + (cantNueva * costoNuevo)) / totalCant;
                        }

                        // Actualizar inventario (Stock y costo1)
                        await Inventariosede.findOneAndUpdate(
                            { idinventario: item.codproducto },
                            {
                                $inc: { cantidispo: cantNueva },
                                $set: {
                                    costo1: Math.round(nuevoCostoPromedio * 10000) / 10000
                                }
                            },
                            { session }
                        );
                    }
                }
            }
        }
//%%%%%%%%%%%%%%%%%%%%%%%%%%  CREAR ARCHIVO DE COSTO DIFERENTE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

 if (Array.isArray(detalles) && detalles.length > 0) {
            for (const item of detalles) {
                if (item.codproducto) {
                    const itemInventario = await Inventariosede.findOne({ idinventario: item.codproducto }).session(session);
                    
                    if (itemInventario) {
                        const cantActual = Number(itemInventario.cantidispo || 0);
                        const costo1Actual = Number(itemInventario.costo1 || 0);
                        
                        const cantNueva = Number(item.cantidad || 0);
                        const costoNuevo = Number(item.costo1 !== undefined ? item.costo1 : (item.costo || 0));

                        // Verificar existencia en CostoDifer
                        const registroExistente = await CostoDifer.findOne({ codproducto: item.codproducto }).session(session);

                        if (!registroExistente) {
                            const nuevoCostoDifer = new CostoDifer({
                                codproducto: itemInventario.idinventario || item.codproducto,
                                descripcion: itemInventario.inventarionombre || item.descripcion || '',
                                cantidad: cantNueva,
                                costonvo: costoNuevo,
                                costoant: costo1Actual,
                                nuevocosto: costoNuevo,
                                fechatransaccion: fechasistema,
                                horatransaccion: workhora
                            });

                            await nuevoCostoDifer.save({ session });
                        } else {
                            await CostoDifer.findOneAndUpdate(
                                { codproducto: item.codproducto },
                                {
                                    $set: {
                                        cantidad: cantNueva,
                                        costonvo: costoNuevo,
                                        costoant: costo1Actual,
                                        nuevocosto: costoNuevo,
                                        fechatransaccion: fechasistema,
                                        horatransaccion: workhora
                                    },
                                    
                                }, { returnDocument: 'after' } 
                            );
                        }
                    }
                }
            }
        }
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
        // 3. Preparar e Insertar CompraDetalle
        const detallesPreparados = detalles.map(detalle => ({
            ...detalle,
            nodocumento: head.nodocumento,
            nofactura: head.nofactura,
            fechadocumento: fechasistema,
            codproveedor: head.codproveedor,
            codproducto: detalle.codproducto,
            descripcion: detalle.descripcion,
            detalle: detalle.detalle,
            cantidad: Math.max(1, detalle.cantidad || 1),
            costo: Math.max(0, detalle.costo || 0),
            tarifa: Math.max(0, detalle.tarifa || 0),
            hora: workhora,
            impuesto: Math.max(0, detalle.impuesto || 0),
            descuento: Math.min(100, Math.max(0, detalle.descuento || 0)),
            subtotal: parseFloat(((detalle.cantidad || 1) * (detalle.costo || 0) * (1 - (detalle.descuento || 0) / 100)).toFixed(2)),
            fechaCreacion: fechasistema
        }));

        const detallesGuardados = await CompraDetalle.insertMany(detallesPreparados, { session });

        // 4. Confirmar transacción
        await session.commitTransaction();
        session.endSession();

        // 5. UNA SOLA RESPUESTA FINAL
        return res.status(201).json({
            success: true,
            message: `✅ Compras Factura ${head.nofactura} e inventarios actualizados exitosamente`,
            data: nuevaCompraHead[0],
            detalles: detallesGuardados
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('❌ Error POST /api/compras/completa:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error al crear la compra completa', 
            error: error.message 
        });
    }
});

app.get('/api/compras/head/todos', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal } = req.query;
        console.log(`📥 GET /api/compras/heads/todos: fechaInicial=${fechaInicial}, fechaFinal=${fechaFinal}`);
        
        let filter = {};

        if (fechaInicial && fechaFinal) {
            filter.fechafactura = { $gte: fechaInicial, $lte: fechaFinal };
            console.log(`📅 compras Filtering by date range: ${fechaInicial} to ${fechaFinal}`);
        } else if (fechaInicial) {
            filter.fechafactura = { $gte: fechaInicial };
            console.log(`📅 compras  Filtering from: ${fechaInicial}`);
        } else if (fechaFinal) {
            filter.fechafactura = { $lte: fechaFinal };
            console.log(`📅 compras Filtering to: ${fechaFinal}`);
        } else {
            console.log(`📅 No date filter applied`);
        }

        console.log(`🔍 Final filter: ${JSON.stringify(filter)}`);
        
        const ListaCompras = await ComprasHead.find(filter).sort({ fechafactura: -1, createdAt: -1 });
        
        console.log(`✅ Found ${ListaCompras.length} compras encontradas`);
        
        if (ListaCompras.length > 0) {
            console.log(`📋 First Compras: ${JSON.stringify(ListaCompras[0])}`);
        }
        
        res.json({
            success: true,
            message: `${ListaCompras.length} Compra(s) encontrada(s)`,
            data: ListaCompras
        });
    } catch (error) {
        console.error('❌ Error GET /api/compras/head/todos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error del servidor', 
            error: error.message 
        });
    }
});


// ============================================================================
// 🔹 RUTAS: COSTO DIFERENTE REPORT - OBTENER REGISTROS POR FECHAS
// ============================================================================
app.get('/api/compras/costodifer', async (req, res) => {
  try {
    const { fechaInicial, fechaFinal } = req.query;
    let filter = {};

    if (fechaInicial && fechaFinal) {
      filter.fechatransaccion = {
        $gte: fechaInicial,
        $lte: fechaFinal
      };
    } else if (fechaInicial) {
      filter.fechatransaccion = { $gte: fechaInicial };
    } else if (fechaFinal) {
      filter.fechatransaccion = { $lte: fechaFinal };
    }

    const registros = await CostoDifer.find(filter).sort({ fechatransaccion: -1, horatransaccion: -1 });

    res.json({
      success: true,
      message: `${registros.length} registro(s) encontrado(s)`,
      data: registros
    });
  } catch (error) {
    console.error('❌ Error GET /api/compras/costodifer:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reporte de costos diferentes',
      error: error.message
    });
  }
});

// GET: Obtener compra por ID o Número de documento
app.get('/api/compras/head/nro/:nodocumento', async (req, res) => {
    try {
        const { nodocumento } = req.params;
        const compra = await ComprasHead.findOne({ nodocumento: nodocumento.trim() });
        if (!compra) {
            return res.status(404).json({ success: false, message: 'Compra no encontrada' });
        }
        res.json({ success: true, data: compra });
    } catch (error) {
        console.error('❌ Error GET /api/compras/head/nro:nodocumento', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// GET: Obtener detalle por número de documento
app.get('/api/compras/detalle/nro/:nodocumento', async (req, res) => {
    try {
        const { nodocumento } = req.params;
        const detalles = await CompraDetalle.find({ nodocumento: nodocumento.trim() });
        res.json({ success: true, data: detalles });
    } catch (error) {
        console.error('❌ Error GET /api/compras/detalle/nro:nodocumento ', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});



// PUT: Actualizar compra completa
app.put('/api/compras/completa/:nodocumento', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { nodocumento } = req.params;
        const { head, detalles } = req.body;

        // 🔹 Definir fecha y hora local antes de procesar los bloques
        const fechasistema = formatLocalYmd(new Date());
        const workhora = new Date().toLocaleTimeString();

        const headActual = await ComprasHead.findOne({ nodocumento }).session(session);
        if (!headActual) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: 'Compra no encontrada con nodocumento' });
        }

        // Actualizar cabecera
        const headActualizada = await ComprasHead.findOneAndUpdate(
            { nodocumento },
            { $set: head },
            { new: true, session }
        );

        // Reemplazar detalles
        await CompraDetalle.deleteMany({ nodocumento }).session(session);

        const detallesGuardados = [];
        if (Array.isArray(detalles) && detalles.length > 0) {
            for (const item of detalles) {
                const nuevoDetalle = new CompraDetalle({
                    ...item,
                    nodocumento
                });
                const dGuardado = await nuevoDetalle.save({ session });
                detallesGuardados.push(dGuardado);

                // 🔹 Recalcular Costo Promedio (costo1) y actualizar stock
                if (item.codproducto) {
                    const itemInventario = await Inventariosede.findOne({ idinventario: item.codproducto }).session(session);

                    if (itemInventario) {
                        const cantActual = Number(itemInventario.cantidispo || 0);
                        const costo1Actual = Number(itemInventario.costo1 || 0);
                        const cantNueva = Number(item.cantidad || 0);
                        const costoNuevo = Number(item.costo || 0);

                        const totalCant = cantActual + cantNueva;

                        let nuevoCostoPromedio = costoNuevo;
                        if (totalCant > 0) {
                            nuevoCostoPromedio = ((cantActual * costo1Actual) + (cantNueva * costoNuevo)) / totalCant;
                        }

                        await Inventariosede.findOneAndUpdate(
                            { idinventario: item.codproducto },
                            {
                                $inc: { cantidispo: cantNueva },
                                $set: {
                                    costo1: Math.round(nuevoCostoPromedio * 10000) / 10000
                                }
                            },
                            { session }
                        );
                    }
                }
            }
        }

        //%%%%%%%%%%%%%%%%%%%%%%%%%% CREAR / ACTUALIZAR ARCHIVO DE COSTO DIFERENTE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
        if (Array.isArray(detalles) && detalles.length > 0) {
            for (const item of detalles) {
                if (item.codproducto) {
                    const itemInventario = await Inventariosede.findOne({ idinventario: item.codproducto }).session(session);
                    
                    if (itemInventario) {
                        const costo1Actual = Number(itemInventario.costo1 || 0);
                        const cantNueva = Number(item.cantidad || 0);
                        const costoNuevo = Number(item.costo1 !== undefined ? item.costo1 : (item.costo || 0));

                        // Verificar existencia en CostoDifer
                        const registroExistente = await CostoDifer.findOne({ codproducto: item.codproducto }).session(session);

                        if (!registroExistente) {
                            const nuevoCostoDifer = new CostoDifer({
                                codproducto: itemInventario.idinventario || item.codproducto,
                                descripcion: itemInventario.inventarionombre || item.descripcion || '',
                                cantidad: cantNueva,
                                costonvo: costoNuevo,
                                costoant: costo1Actual,
                                nuevocosto: costoNuevo,
                                fechatransaccion: fechasistema,
                                horatransaccion: workhora
                            });

                            await nuevoCostoDifer.save({ session });
                        } else {
                            await CostoDifer.findOneAndUpdate(
                                { codproducto: item.codproducto },
                                {
                                    $set: {
                                        cantidad: cantNueva,
                                        costonvo: costoNuevo,
                                        costoant: costo1Actual,
                                        nuevocosto: costoNuevo,
                                        fechatransaccion: fechasistema,
                                        horatransaccion: workhora
                                    }
                                },
                                { session }
                            );
                        }
                    }
                }
            }
        }
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
// 🔹 ACTUALIZAR ACUMULADO DE COMPRAS DEL PROVEEDOR (compraprove)
        if (headActualizada.codproveedor) {
            // 1. Recalcular el total de todas las compras activas (no anuladas) de este proveedor
            const resumenCompras = await ComprasHead.aggregate([
                { 
                    $match: { 
                        codproveedor: headActualizada.codproveedor, 
                        estatuscompra: { $ne: 'E' } // Excluir compras anuladas
                    } 
                },
                { 
                    $group: { 
                        _id: null, 
                        totalAcumulado: { $sum: "$total" } 
                    } 
                }
            ]).session(session);

            const nuevoCompraprove = resumenCompras.length > 0 ? resumenCompras[0].totalAcumulado : 0;

            // 2. Actualizar el campo compraprove en el documento del Proveedor
            await Proveedor.findOneAndUpdate(
                { idprov: headActualizada.codproveedor },
                { $set: { compraprove: nuevoCompraprove } },
                { session }
            );
        }

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
        await session.commitTransaction();
        res.json({
            success: true,
            message: '✅ Compra e inventarios actualizados exitosamente',
            data: headActualizada,
            detalles: detallesGuardados
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('❌ Error PUT /api/compras/completa:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar compra', error: error.message });
    } finally {
        session.endSession();
    }
});

// PUT: Anular Compra (Maneja reversión según tipo de pago Crédito vs Contado)
app.put('/api/compras/anular/head/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;

        const compra = await ComprasHead.findOne({
            $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { nodocumento: id }]
        }).session(session);

        if (!compra) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: 'Compra no encontrada' });
        }

        // Marcar compra como anulada
        compra.estatuscompra = 'E';
        await compra.save({ session });

        // 🔹 Revertir existencias agregadas previamente
        const detalles = await CompraDetalle.find({ nodocumento: compra.nodocumento }).session(session);
        for (const item of detalles) {
            if (item.codproducto) {
                await Inventariosede.findOneAndUpdate(
                    { idinventario: item.codproducto },
                    { $inc: { cantidispo: -(item.cantidad || 0) } },
                    { session }
                );
            }
        }

        await session.commitTransaction();
        res.json({ success: true, message: '🗑️ Compra anulada y stock revertido correctamente' });

    } catch (error) {
        await session.abortTransaction();
        console.error('❌ Error PUT /api/compras/anular/head:', error);
        res.status(500).json({ success: false, message: 'Error al anular compra', error: error.message });
    } finally {
        session.endSession();
    }
});

// ============================================================================
// 🔹 RUTAS: APLICA NOTA DE CRÉDITO
// ============================================================================

// 1) LISTAR NotaCreditoHead por rango de fechas (fechacredito)
app.get('/api/ventas/notascredito/head', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal } = req.query;
        let filter = {};
        if (fechaInicial && fechaFinal) {
            filter.fechacredito = { $gte: fechaInicial, $lte: fechaFinal };
        } else if (fechaInicial) {
            filter.fechacredito = { $gte: fechaInicial };
        } else if (fechaFinal) {
            filter.fechacredito = { $lte: fechaFinal };
        }
        const notas = await NotaCreditoHead.find(filter).sort({ fechacredito: -1 });
        res.json({
            success: true,
            message: `${notas.length} nota(s) de crédito encontrada(s)`,
            data: notas
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/notascredito/head:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// 2) OBTENER detalles de una Nota de Crédito por su nocredito
app.get('/api/ventas/notascredito/detalles/nocredito/:nocredito', async (req, res) => {
    try {
        const { nocredito } = req.params;
        const detalles = await NotaCreditoDetalle.find({ nocredito: nocredito.trim() });
        res.json({
            success: true,
            message: `${detalles.length} detalle(s) encontrado(s)`,
            data: detalles
        });
    } catch (error) {
        console.error('❌ Error GET /api/ventas/notascredito/detalles/nocredito:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// 3) APLICAR crédito como pago (actualiza NotaCreditoHead + crea transacción)
app.post('/api/ventas/notascredito/aplicar/:nocredito', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { nocredito } = req.params;
        const {
            asignadoa, cedulasignadoa, realizado, utilizado, cedulautilizado,
            fechautilizado, facturautilizado, montotran, comentario, formapago
        } = req.body;

        const notaCredito = await NotaCreditoHead.findOne({ nocredito: nocredito.trim() }).session(session);
        if (!notaCredito) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: 'Nota de crédito no encontrada' });
        }

        // Calcular saldo disponible = total - suma de transacciones previas
        const transaccionesPrevias = await NotaAplicaCredito.find({ nocredito: nocredito.trim() }).session(session);
        const totalAplicadoPrevio = transaccionesPrevias.reduce((sum, t) => sum + (t.montotran || 0), 0);
        const saldoDisponible = (notaCredito.total || 0) - totalAplicadoPrevio;

        const montoAplicar = parseFloat(montotran) || 0;
        if (montoAplicar <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'El monto a aplicar debe ser mayor a 0' });
        }
        if (montoAplicar > saldoDisponible) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: `El monto excede el saldo disponible (${saldoDisponible.toFixed(2)})` });
        }

        // Generar número de transacción consecutivo
        const lastTran = await NotaAplicaCredito.findOne().sort({ notransaccion: -1 }).session(session);
        const notransaccion = (lastTran && lastTran.notransaccion ? lastTran.notransaccion : 0) + 1;
        const fechasistema = formatLocalYmd(new Date());

        // Crear la transacción
        const nuevaTransaccion = new NotaAplicaCredito({
            notransaccion: notransaccion,
            nocredito: notaCredito.nocredito,
            nofactura: notaCredito.nofactura,
            fechacredito: notaCredito.fechacredito,
            fechatransaccion: fechasistema,
            fechavencimiento: notaCredito.fechavencimiento,
            facturaplicada: facturautilizado || '',
            codcliente: notaCredito.codcliente,
            codglobal: notaCredito.idglobalcorpo || '',
            cliente: notaCredito.nombreclie,
            utilizado: utilizado || '',
            cedulautilizado: cedulautilizado || '',
            formapago: formapago || '06',
            saldoanterior: saldoDisponible,
            montotran: montoAplicar,
            comentario: comentario || ''
        });
        await nuevaTransaccion.save({ session });

        // Actualizar NotaCreditoHead con los campos de asignación + nuevo saldo
        const nuevoSaldo = saldoDisponible - montoAplicar;
        await NotaCreditoHead.findOneAndUpdate(
            { nocredito: nocredito.trim() },
            {
                $set: {
                    asignadoa: asignadoa || '',
                    cedulasignadoa: cedulasignadoa || '',
                    realizado: realizado || '',
                    utilizado: utilizado || '',
                    cedulautilizado: cedulautilizado || '',
                    fechautilizado: fechautilizado || fechasistema,
                    facturautilizado: facturautilizado || '',
                    saldo: nuevoSaldo,
                    fechaActualizacion: new Date().toISOString()
                }
            },
            { new: true, session }
        );

        await session.commitTransaction();
        res.status(200).json({
            success: true,
            message: '✅ Crédito aplicado exitosamente',
            data: nuevaTransaccion
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('❌ Error POST /api/ventas/notascredito/aplicar:', error);
        res.status(500).json({ success: false, message: 'Error al aplicar crédito', error: error.message });
    } finally {
        session.endSession();
    }
});

// ============================================================================
// 🔹 RUTAS: CUENTAS POR PAGAR (CXP)
// ============================================================================

// 1. Obtener facturas de compra con saldo pendiente
app.get('/api/compras/cxp/facturas', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal, nombreProveedor } = req.query;
        let filter = { saldo: { $gt: 0 }, estatuscompra: { $ne: 'E' } };
        
        if (fechaInicial && fechaFinal) {
            filter.fechafactura = { $gte: fechaInicial, $lte: fechaFinal };
        }
        if (nombreProveedor) {
            filter.nombreproveedor = { $regex: nombreProveedor, $options: 'i' };
        }
        
        const facturas = await ComprasHead.find(filter).sort({ fechafactura: -1 });
        res.json({ success: true, message: `${facturas.length} facturas encontradas`, data: facturas });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. Registrar Abono a Proveedor
app.post('/api/compras/cxp/abono', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { nodocumento, montotran, formapago, fechaabono, comentario } = req.body;
        const factura = await ComprasHead.findOne({ nodocumento }).session(session);
        
        if (!factura) throw new Error('Documento de compra no encontrado');
        if (montotran <= 0) throw new Error('El monto debe ser mayor a 0');
        if (montotran > factura.saldo) throw new Error(`El monto excede el saldo pendiente (${factura.saldo})`);

        const lastTran = await TranCxPagar.findOne().sort({ notransaccion: -1 }).session(session);
        const notransaccion = (lastTran ? lastTran.notransaccion : 0) + 1;

        const nuevoAbono = new TranCxPagar({
            notransaccion,
            nodocumento: factura.nodocumento,
            nofactura: factura.nofactura,
            fechafactura: factura.fechafactura,
            fechatransaccion: new Date().toISOString(),
            fechaabono,
            fechavencimiento: factura.fechavencimiento,
            codproveedor: factura.codproveedor,
            provnombre: factura.nombreproveedor,
            formapago,
            saldoanterior: factura.saldo,
            montotran,
            estadotrans: 'A',
            comentario
        });
        await nuevoAbono.save({ session });

        // Descontar saldo a la factura de compra
        await ComprasHead.findOneAndUpdate(
            { nodocumento },
            { $inc: { saldo: -montotran } },
            { session }
        );

        await session.commitTransaction();
        res.status(201).json({ success: true, message: 'Abono a proveedor registrado', data: nuevoAbono });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
});

// 3. Obtener Saldos por Proveedor
app.get('/api/compras/cxp/saldos', async (req, res) => {
    try {
        const { fechaInicial, fechaFinal, nombreProveedor } = req.query;
        let matchFilter = { saldo: { $gt: 0 }, estatuscompra: { $ne: 'E' } };
        
        if (fechaInicial && fechaFinal) matchFilter.fechafactura = { $gte: fechaInicial, $lte: fechaFinal };
        if (nombreProveedor) matchFilter.nombreproveedor = { $regex: nombreProveedor, $options: 'i' };

        const saldos = await ComprasHead.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: "$codproveedor",
                    provnombre: { $first: "$nombreproveedor" },
                    totalFacturado: { $sum: "$total" },
                    totalAbonado: { $sum: { $subtract: ["$total", "$saldo"] } },
                    saldoPendiente: { $sum: "$saldo" }
                }
            },
            { $sort: { provnombre: 1 } }
        ]);
        
        const result = saldos.map(s => ({
            codproveedor: s._id,
            provnombre: s.provnombre,
            totalFacturado: s.totalFacturado,
            totalAbonado: s.totalAbonado,
            saldoPendiente: s.saldoPendiente
        }));

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ============================================================================
// 🔹 RUTAS: FORMA DE PAGO
// ============================================================================


// GET: Listar todas las formas de pago
app.get('/api/config/formapago', async (req, res) => {
    try {
        const formasPago = await FormaPago.find({}).sort({ codigo: 1 });
        res.json({ success: true, message: 'Formas de pago obtenidas', data: formasPago });
    } catch (error) {
        console.error('❌ Error GET /api/config/formapago:', error);
        res.status(500).json({ success: false, message: 'Error del servidor', error: error.message });
    }
});

// POST: Crear nueva forma de pago
app.post('/api/config/formapago', async (req, res) => {
    try {
        const { codigo, descripcion } = req.body;
        if (!codigo?.trim() || !descripcion?.trim()) {
            return res.status(400).json({ success: false, message: 'Código y Descripción son obligatorios' });
        }
        const existing = await FormaPago.findOne({ codigo: codigo.trim().toUpperCase() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Ya existe una forma de pago con este código' });
        }
        const nuevaFormaPago = await FormaPago.create({
            codigo: codigo.trim().toUpperCase(),
            descripcion: descripcion.trim().toUpperCase()
        });
        res.status(201).json({ success: true, message: '✅ Forma de pago creada exitosamente', data: nuevaFormaPago });
    } catch (error) {
        console.error('❌ Error POST /api/config/formapago:', error);
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'El código ya existe' });
        res.status(500).json({ success: false, message: 'Error al crear', error: error.message });
    }
});

// PUT: Editar descripción de forma de pago
app.put('/api/config/formapago/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
        
        const updateData = { ...req.body };
        delete updateData.codigo; // No permitir cambiar el código
        delete updateData._id;
        updateData.fechaActualizacion = new Date().toISOString();
        if (updateData.descripcion) updateData.descripcion = updateData.descripcion.trim().toUpperCase();

        const actualizado = await FormaPago.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!actualizado) return res.status(404).json({ success: false, message: 'Forma de pago no encontrada' });
        
        res.json({ success: true, message: '✅ Forma de pago actualizada', data: actualizado });
    } catch (error) {
        console.error('❌ Error PUT /api/config/formapago:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
});

// DELETE: Eliminar forma de pago
app.delete('/api/config/formapago/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
        
        const eliminado = await FormaPago.findByIdAndDelete(id);
        if (!eliminado) return res.status(404).json({ success: false, message: 'Forma de pago no encontrada' });
        
        res.json({ success: true, message: '🗑️ Forma de pago eliminada exitosamente' });
    } catch (error) {
        console.error('❌ Error DELETE /api/config/formapago:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar', error: error.message });
    }
});
// ============================================================================
// 🔹 HELPER: FORMATO DE FECHA ESTRICTO PARA PANAMÁ (UTC-5) - VERSIÓN INFALIBLE
// ============================================================================
function getPanamaISODate(dateInput = new Date()) {
    const d = new Date(dateInput);
    
    // Restamos exactamente 5 horas (5 * 60 min * 60 seg * 1000 ms) al tiempo UTC
    const panamaTime = new Date(d.getTime() - (5 * 60 * 60 * 1000));
    
    // Extraemos los componentes usando métodos UTC (que ahora reflejan la hora de Panamá)
    const year = String(panamaTime.getUTCFullYear());
    const month = String(panamaTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(panamaTime.getUTCDate()).padStart(2, '0');
    const hours = String(panamaTime.getUTCHours()).padStart(2, '0');
    const minutes = String(panamaTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(panamaTime.getUTCSeconds()).padStart(2, '0');
    
    // Construimos el string exacto que exige TheFactory
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-05:00`;
}

async function recalcularVentasCliente(codcliente) {
    if (!codcliente) return;
    
    // ✅ 1. Trim the code to avoid space issues (e.g. "CLI12345 " vs "CLI12345")
    const cleanCod = codcliente;
    if (!cleanCod) return;

    try {
        console.log(`🔄 Recalculando ventas para cliente: ${codcliente}`);
        
        // ✅ 2. Sum all 'total' from accepted invoices using case-insensitive regex
        // This ensures it catches old invoices even if they were saved as uppercase previously
        const result = await FacturaHead.aggregate([
            { $match: { 
                codcliente: codcliente, 
                estado: { $nin: ['E', 'Anulada', 'Rechazada'] } 
            }},
            { $group: { 
                _id: null, 
                totalVentas: { $sum: { $ifNull: ["$total", 0] } } 
            }}
        ]);

        const nuevoTotal = result.length > 0 ? result[0].totalVentas : 0;
        console.log(`💰 Nuevo total calculado para ${codcliente}: ${nuevoTotal}`);

        // ✅ 3. Find and update the client using case-insensitive regex
        const clienteActualizado = await Cliente.findOneAndUpdate(
            { idcliente: codcliente }, 
            { $set: { ventascliente: nuevoTotal } },
            { returnDocument: 'after', runValidators: true } // ✅ Fixes the Mongoose deprecation warning
        );

        if (!clienteActualizado) {
            console.warn(`⚠️ No se encontró el cliente con idcliente: ${codcliente} en la base de datos.`);
        } else {
            console.log(`✅ Ventas del cliente ${codcliente} actualizadas correctamente en DB.`);
        }
    } catch (error) {
        console.error('❌ Error interno en recalcularVentasCliente:', error);
    }
}


async function descontarFolioPAC() {
    try {
        const empresa = await EmpresaConfig.findOne({});
        if (empresa) {
            const nuevosFolios = Math.max(0, (empresa.nofoliospac || 0) - 1);
            await EmpresaConfig.findByIdAndUpdate(
                empresa._id,
                { $set: { nofoliospac: nuevosFolios } }
            );
            console.log(`✅ Folio PAC descontado. Folios restantes: ${nuevosFolios}`);
        }
    } catch (error) {
        console.error('❌ Error descontando folio PAC:', error);
    }
}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
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