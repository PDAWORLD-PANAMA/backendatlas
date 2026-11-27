const mongoose = require('mongoose');

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
  webdireccion : { type: String},
 sucursales: [SucursalSchema] 
  
  // The GeoJSON field for Google Maps
 
});

const Cliente = mongoose.model('Cliente', SchemadelCliente);
