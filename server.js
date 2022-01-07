'use strict'

/**** */
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const multipart = require('connect-multiparty');

const multiPartMiddleware = multipart({
    uploadDir: './public/images-avatar'
});


const app = express();
const port = 9706;

app.use(cors());

// Configuring body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuracion para subir imagenes
app.use(fileUpload());

// Importamos las rutas
var routes = require('./url/url');
const inicio = require('./controllers/apis');


// Cargamos las rutas
app.use('/apis', routes);
app.get('/apis', inicio.getApis);

module.exports = app;



const conexion = require('./database/database');
conexion.connect(function(err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Estado de conexion conectado');
});

app.listen(port, () => console.log(`El servidor esta escuchando en el puerto ${port}!`));