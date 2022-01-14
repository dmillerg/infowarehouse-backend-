'use strict'

// Cargamos el módulo de express para poder crear rutas
var express = require('express');

// Cargamos los controladores
var usuario_controller = require('../controllers/usuarios');
var factura_controller = require('../controllers/factura');

var managedb_controller = require('../database/manageDB');
var login_controller = require('../controllers/login');
var producto_controller = require('../controllers/producto');
var tarjeta_estiba_controller = require('../controllers/tarjeta_estiba');
var historial_tarjeta_estiba_controller = require('../controllers/historial_tarjeta_estiba');
var informe_recepcion_controller = require('../controllers/informe');
// var superuser_controller = require('../database/superuser');

// Llamamos al router
var api = express.Router();

// Rutas para las api de usuario
api.post('/saveUsuario', usuario_controller.saveUsuario);
api.get('/usuarios/:limit', usuario_controller.getUsuarios);
api.get('/usuario/:id', usuario_controller.getUsuario);
api.post('/usuarios/:id', usuario_controller.updateUsuario);
api.delete('/deleteUsuario/:id', usuario_controller.deleteUsuario);

//Rutas para manejar base de datos
api.get('/database', managedb_controller.createTables);
api.post('/all', managedb_controller.all);
api.get('/loadSQL', managedb_controller.loadSQL);

// Rutas para login and logout
api.post('/login', login_controller.login);
api.post('/logout', login_controller.logout);

//Rutas para Facturas
api.get('/facturas', factura_controller.getFactura);
api.post('/facturas', factura_controller.saveFactura);
api.delete('/facturas/:codigo', factura_controller.deleteFactura);

// Rutas para productos
api.get('/productos', producto_controller.getProductos);
api.post('/productos', producto_controller.saveProductos);
api.delete('/productos/:id', producto_controller.deleteProducto);
api.get('/productos/:id', producto_controller.updateProducto);

// Rutas para tarjetas estibas
api.get('/tarjetas',tarjeta_estiba_controller.getTarjetas);
api.post('/tarjetas',tarjeta_estiba_controller.saveTarjetaEstiba);
api.delete('/tarjetas',tarjeta_estiba_controller.deleteTarjetaEstiba);
api.get('/tarjetas/:codigo',tarjeta_estiba_controller.getTarjetaEstibaByCodigo);

// Rutas para historial de tarjetas estiba
api.get('/historialtarjeta/:codigo', historial_tarjeta_estiba_controller.getHistorialTarjetaEstiba);
api.post('/historialtarjeta', historial_tarjeta_estiba_controller.saveHistorialTarjetaEstiba);
api.delete('/historialtarjeta/:id', historial_tarjeta_estiba_controller.deleteHistorialTarjetaEstiba);
api.get('/historialtarjeta/:id', historial_tarjeta_estiba_controller.getTarjetaEstibaByCodigo);

// Rutas para informes
api.get('/informe',informe_recepcion_controller.getInforme)
api.get('/informe/:anno',informe_recepcion_controller.getInformeByYear)
api.post('/informe',informe_recepcion_controller.saveinforme)

// Exportamos la configuración
module.exports = api;