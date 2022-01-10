'use strict'

// Cargamos el módulo de express para poder crear rutas
var express = require('express');

// Cargamos los controladores
var usuario_controller = require('../controllers/usuarios');
var factura_controller = require('../controllers/factura');

var managedb_controller = require('../database/manageDB');
var login_controller = require('../controllers/login');
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

// Exportamos la configuración
module.exports = api;