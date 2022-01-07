const scrapeIt = require("scrape-it");
const conexion = require("../database/database");

let interval = 0;

function recogidaNoticia(req, res) {
    conexion.query(
        `SELECT * FROM noticias `,
        function (error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                return res.status(200).send({ documents: "no hay noticias" });
            }
        }
    );
}

async function recogida() {
    let scrape = [];
    conexion.query(`DELETE FROM noticias WHERE fuente<>"ICEM"`);
    conexion.query(`SELECT * FROM scrap WHERE activo=1`, function (error, results, fields) {
        if (results.length > 0) {
            results.forEach(ele => {
                scrapeItAll(ele).then(function (e) {
                    scrape = [];
                    e.forEach(el => {
                        if (ele.fuente == 'granma') {
                            el.enlace = 'https://www.granma.cu' + el.enlace;
                            el.imagen = 'https://www.granma.cu' + el.imagen;
                        }
                        scrape.push({
                            titulo: el.titulo,
                            descripcion: el.descripcion,
                            fecha: el.fecha,
                            imagen: el.imagen,
                            enlace: el.enlace,
                            fuente: ele.fuente,
                            logo: ele.logo
                        });
                    });
                    scrape.forEach((e, index, array) => {
                        conexion.query(`INSERT INTO noticias(id, titulo, descripcion, fecha, imagen, enlace, fuente, logo) VALUES (NULL, '${e.titulo}', '${e.descripcion}', '${e.fecha}', '${e.imagen}', '${e.enlace}', '${e.fuente}', '${e.logo}')`, function (error, resultado, fieldss) {
                            if (index === array.length - 1) return;
                            if (resultado) {
                                // console.log('success', e);
                            }
                            if (error) {
                                // console.error('ERROR', error);
                            }
                        });
                    });
                });
            });
        }
    });
}

async function scrapeItAll(elemet) {
    try {
        const scrapeResult = await scrapeIt(elemet.url, {
            presentations: {
                listItem: elemet.contenedor,
                data: {
                    titulo: elemet.titulo,
                    descripcion: elemet.descripcion,
                    fecha: elemet.fecha,
                    enlace: {
                        selector: elemet.enlace_selector,
                        attr: elemet.enlace_attr
                    },
                    imagen: {
                        selector: elemet.imagen_selector,
                        attr: elemet.imagen_attr
                    }
                }
            }
        });
        return scrapeResult.data.presentations;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

function iniciarScrapping(req, res) {
    recogida().then((e) => {
        console.log('SUCCESS', 'Se han recogido los datos de las paginas correctamente');
    });
    interval = setInterval(() => {
        try {
            recogida().then(() => {
                console.log('SUCCESS', 'Se han recogido los datos de las paginas correctamente');
            });
        } catch (e) {
            console.log('En estos momentos no se puede acceder por favor intente mas tarde');
        }
    }, req.params.time);
    return res.status(200).send({ message: `intervalo creado en ${req.params.time}` })
}

function detenerScrapping(req, res) {
    clearInterval(interval);
    return res.status(200).send({ message: 'intervalo detenido' })
}

function probarScrap(req, res) {
    conexion.query(
        `SELECT * FROM tokens WHERE token='${req.body.token}'`,
        function (err, result) {
            if (err) {
                return res.status(405).send({ message: "usuario no autenticado" });
            }
            if (result.length > 0) {
                let id = req.params.id;
                if (id == -1) {
                    scrapeItAll(req.body).then((e) => {
                        return res.status(200).send(e);
                    });
                } else {
                    conexion.query(`SELECT * FROM scrap WHERE id=${id}`, function (error, result, field) {
                        if (error) {
                            return res.status(500).send({ message: error });
                        } else {
                            scrapeItAll(result[0]).then((e) => {
                                return res.status(200).send(e);
                            });
                        }
                    });
                }
            }
        });
}

function saveScrap(req, res) {
    conexion.query(
        `SELECT * FROM tokens WHERE token='${req.body.token}'`,
        function (err, result) {
            if (err) {
                return res.status(405).send({ message: "usuario no autenticado" });
            }
            if (result.length > 0) {
                let body = req.body;
                let contenedor = body.contenedor;
                let titulo = body.titulo;
                let fecha = body.fecha;
                let descripcion = body.descripcion;
                let enlace_selector = body.enlace_selector;
                let enlace_attr = body.enlace_attr;
                let imagen_selector = body.imagen_selector
                let imagen_attr = body.imagen_selector
                let url = body.url;
                let fuente = body.fuente;
                let logo = body.logo;
                let query = `INSERT INTO scrap (id, contenedor, titulo, fecha, descripcion, enlace_selector, enlace_attr, imagen_selector, imagen_attr, url, fuente, logo) VALUES (NULL, "${contenedor}", "${titulo}", "${fecha}","${descripcion}","${enlace_selector}","${enlace_attr}","${imagen_selector}","${imagen_attr}","${url}","${fuente}","${logo}")`;
                conexion.query(query, function (error, results, fields) {
                    if (error) {
                        return res.status(500).send({ message: error });
                    }
                    if (results) {
                        return res.status(200).send({ message: results });
                    }
                });
            }
        });
}

function deleteScrap(req, res) {
    conexion.query(
        `SELECT * FROM tokens WHERE token='${req.query.token}'`,
        function (err, result) {
            if (err) {
                return res.status(405).send({ message: "usuario no autenticado" });
            }
            if (result.length > 0) {
                let id = req.params.id;
                conexion.query(`DELETE FROM scrap WHERE id=${id}`, function (error, results, fields) {
                    if (error) {
                        return res.status(500).send({ message: error });
                    }
                    if (results) {
                        return res.status(200).send({ message: results });
                    }
                });
            }
        });
}

function getScraps(req, res) {
    var limit = req.params.limit;
    var query = ``;
    query += ` ORDER BY id DESC`;
    if (limit > 0) {
        query += ` LIMIT ${limit}`;
    }

    conexion.query(
        `SELECT * FROM scrap WHERE 1` + query,
        function (error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                return res.status(200).send({ message: "no hay scraps" });
            }
        }
    );
}

function updateScrap(req, res) {
    // Recogemos un parámetro por la url
    conexion.query(
        `SELECT * FROM tokens WHERE token='${req.body.token}'`,
        function (err, result) {
            if (err) {
                return res.status(405).send({ message: "usuario no autenticado" });
            }
            if (result.length > 0) {

                var id = req.params.id;
                // Recogemos los datos que nos llegen en el body de la petición
                var update = req.body;
                var contenedor = update.contenedor;
                var titulo = update.titulo;
                var fecha = update.fecha;
                var descripcion = update.descripcion;
                var enlace_selector = update.enlace_selector;
                var enlace_attr = update.enlace_attr;
                var imagen_selector = update.imagen_selector;
                var imagen_attr = update.imagen_attr;
                var url = update.url;
                var fuente = update.fuente;
                var logo = update.logo;
                var activo = update.activo;
                // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
                var query = `UPDATE scrap SET contenedor="${contenedor}", titulo="${titulo}", fecha="${fecha}", descripcion="${descripcion}", enlace_selector="${enlace_selector}" , enlace_attr="${enlace_attr}", imagen_selector="${imagen_selector}", imagen_attr="${imagen_attr}", url="${url}", fuente="${fuente}", logo="${logo}", activo=${activo} `;
                query += `WHERE id = ${id}`;
                conexion.query(query, function (error, results, fields) {
                    if (error)
                        return res.status(500).send({ message: "error en el servidor " + error });
                    if (results) {
                        return res
                            .status(201)
                            .send({ message: "actualizado correctamente" });
                    } else {
                        return res
                            .status(404)
                            .send({ message: "no existe ningun scrap con ese id" });
                    }
                });
            }
        });
}


module.exports = {
    recogidaNoticia,
    recogida,
    iniciarScrapping,
    detenerScrapping,
    saveScrap,
    deleteScrap,
    getScraps,
    updateScrap,
    probarScrap,
}