const conexion = require("../database/database");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");

function getDesarrollos(req, res) {
    var id = req.params.id;
    var limit = req.params.limit;
    var query = ``;
    if (limit > 0) {
        query += ` LIMIT ${limit}`;
    }

    conexion.query(
        `SELECT * FROM desarrollos ` + query,
        function(error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                return res.status(200).send({ documents: "no hay desarrollos" });
            }
        }
    );
}

function getDesarrolloFoto(req, res) {
    try {
        var id = req.params.id;
        conexion.query(
            `SELECT * FROM desarrollos WHERE id = ${id}`,
            function(error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {
                    var path = require("path");
                    res.sendFile(path.resolve("public/desarrollos/" + results[0].imagen));
                } else {
                    return res
                        .status(404)
                        .send({ documento: "no existe ningun desarrollo con ese id" });
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
}

function saveDesarrollo(req, res) {
    conexion.query(
        `SELECT * FROM tokens WHERE token='${req.body.token}'`,
        function(err, result) {
            if (err) {
                return res.status(405).send({ message: "usuario no autenticado" });
            }
            if (result.length > 0) {
                var id = -1;
                console.log(req.body);
                var body = req.body;
                var titulo = body.titulo;
                var descripcion = body.descripcion;
                var foto = { name: null };
                if (req.files) {
                    foto = req.files.foto;
                    foto_name = titulo.replace(/ /g, "-") + ".jpg";
                    console.log(foto_name);
                }
                let date = new Date();
                let fecha =
                    date.getFullYear().toString() +
                    "/" +
                    (date.getMonth() + 1) +
                    "/" +
                    date.getDate() +
                    " " +
                    date.getHours() +
                    ":" +
                    date.getMinutes() +
                    ":" +
                    date.getSeconds();

                conexion.query(
                    `INSERT INTO desarrollos(id, titulo, descripcion, fecha, imagen) VALUES (NULL,"${titulo}","${descripcion}","${fecha}", "${foto_name}")`,
                    function(error, results, fields) {
                        if (error) return res.status(500).send({ message: error });
                        if (results) {
                            if (req.files) saveFoto(foto, foto_name);
                            return res
                                .status(201)
                                .send({ message: "desarrollo guardado correctamente" });
                        }
                    }
                );
            }
        }
    );
}

function saveFoto(foto, titulo) {
    if (foto.name != null) {
        foto.mv(`./public/desarrollos/${titulo}`, function(err) {});
    }
}

function deleteDesarrollo(req, res) {
    conexion.query(
        `SELECT * FROM tokens WHERE token='${req.query.token}'`,
        function(err, result) {
            if (err) {
                return res.status(405).send({ message: "usuario no autenticado" });
            }
            if (result.length > 0) {
                console.log("desarr");
                const id = req.params.id;
                conexion.query(
                    `SELECT * FROM desarrollos WHERE id=${id}`,
                    function(err, result) {
                        if (err) return res.status(500).send({ message: err });
                        if (result) {
                            deleteFoto(result[0].imagen);
                            conexion.query(
                                `DELETE FROM desarrollos WHERE id = ${id}`,
                                function(error, results, fields) {
                                    if (error) return error;
                                    if (results) {
                                        return res.status(200).send({ results });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
}

function deleteFoto(imagen) {
    const pathViejo = `./public/desarrollos/${imagen}`;
    // console.log(pathViejo);
    const fs = require("fs");
    if (fs.existsSync(pathViejo)) {
        console.log("borrado");
        fs.unlinkSync(pathViejo);
    }
    return "borrado correctamente";
}

function updateDesarrollo(req, res) {
    conexion.query(
        `SELECT * FROM tokens WHERE token='${req.body.token}'`,
        function(err, result) {
            if (err) {
                return res.status(405).send({ message: "usuario no autenticado" });
            }
            if (result.length > 0) {
                // Recogemos un parámetro por la url
                var id = req.params.id;

                // Recogemos los datos que nos llegen en el body de la petición
                var update = req.body;
                var titulo = update.titulo;
                var descripcion = update.descripcion;
                var foto = { name: null };
                if (req.files) foto = req.files.foto;
                console.log(foto.name, "foto");
                // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
                var query = `UPDATE desarrollos SET titulo="${titulo}",descripcion="${descripcion}"`;
                if (foto.name != null)
                query += `,imagen="${titulo.replace(/ /g, "-") + ".jpg"}"`;
                query += `WHERE id = ${id}`;

                conexion.query(query, function(error, results, fields) {
                    if (error)
                        return res.status(500).send({ message: "error en el servidor" });
                    if (results) {
                        if (foto.name != null) {
                            deleteFoto(titulo.replace(/ /g, "-") + ".jpg");
                            saveFoto(foto, titulo.replace(/ /g, "-") + ".jpg");
                        }
                        return res
                            .status(201)
                            .send({ message: "actualizado correctamente" });
                    } else {
                        return res
                            .status(404)
                            .send({ message: "no existe ningun desarrollo con ese id" });
                    }
                });
            }
        }
    );
}

function searchDesarrollos(req, res) {
    let titulo = req.params.titulo;
    let query = `SELECT * FROM desarrollos WHERE titulo like"%${titulo}%"`;
    console.log(query);
    conexion.query(query, function(err, result) {
        if (err) return res.status(500).send({ message: err });
        if (result) {
            return res.status(200).send({ result });
        }
    });
}

function getDesarrolloById(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM desarrollos WHERE id=${id}`;
    conexion.query(query, function(err, result) {
        if (err) return res.status(500).send({ message: err });
        if (result) {
            return res.status(200).send({ result });
        }
    });
}

module.exports = {
    getDesarrollos,
    getDesarrolloFoto,
    saveDesarrollo,
    deleteDesarrollo,
    updateDesarrollo,
    getDesarrolloById,
    searchDesarrollos,
};