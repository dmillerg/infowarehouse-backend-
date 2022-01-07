const conexion = require("../database/database");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");

function getNoticias(req, res) {
    var limit = req.params.limit;
    var query = ``;
    query += ` ORDER BY id DESC`;
    if (limit > 0) {
        query += ` LIMIT ${limit}`;
    }

    conexion.query(
        `SELECT * FROM noticias ` + query,
        function(error, results, fields) {
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

function getNoticiaFoto(req, res) {
    try {
        var id = req.params.id;
        conexion.query(
            `SELECT * FROM noticias WHERE id = ${id}`,
            function(error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {
                    var path = require("path");
                    res.sendFile(path.resolve("public/noticias/" + results[0].imagen));
                } else {
                    return res
                        .status(404)
                        .send({ documento: "no existe ninguna noticia con ese id" });
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
}

function saveNoticia(req, res) {
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
                    `INSERT INTO noticias(id, titulo, descripcion, fecha, imagen) VALUES (NULL,"${titulo}","${descripcion}","${fecha}", "${foto_name}")`,
                    function(error, results, fields) {
                        if (error) return res.status(500).send({ message: error });
                        if (results) {
                            if (req.files) saveFoto(foto, foto_name);
                            return res
                                .status(201)
                                .send({ message: "noticia guardado correctamente" });
                        }
                    }
                );
            }
        }
    );
}

function saveFoto(foto, titulo) {
    if (foto.name != null) {
        foto.mv(`./public/noticias/${titulo}`, function(err) {});
    }
}

function deleteNoticia(req, res) {
    conexion.query(
        `SELECT * FROM tokens WHERE token='${req.query.token}'`,
        function(err, result) {
            if (err) {
                return res.status(405).send({ message: "usuario no autenticado" });
            }
            if (result.length > 0) {
                const id = req.params.id;
                conexion.query(
                    `SELECT * FROM noticias WHERE id=${id}`,
                    function(err, result) {
                        if (err) return res.status(500).send({ message: err });
                        if (result) {
                            deleteFoto(result[0].imagen);
                            conexion.query(
                                `DELETE FROM noticias WHERE id = ${id}`,
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
    const pathViejo = `./public/noticias/${imagen}`;
    // console.log(pathViejo);
    const fs = require("fs");
    if (fs.existsSync(pathViejo)) {
        console.log("borrado");
        fs.unlinkSync(pathViejo);
    }
    return "borrado correctamente";
}

function updateNoticia(req, res) {
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
                var foto_name = "";
                if (req.files) {
                    foto = req.files.foto;
                    foto_name = titulo.replace(/ /g, "-") + ".jpg";
                }
                console.log(foto.name, "foto");
                // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
                var query = `UPDATE noticias SET titulo="${titulo}",descripcion="${descripcion}"`;
                if (foto.name != null) query += `,imagen="${foto_name}"`;
                query += `WHERE id = ${id}`;

                conexion.query(query, function(error, results, fields) {
                    if (error)
                        return res.status(500).send({ message: "error en el servidor" });
                    if (results) {
                        if (foto.name != null) {
                            deleteFoto(foto_name);
                            saveFoto(foto, foto_name);
                        }
                        return res
                            .status(201)
                            .send({ message: "actualizado correctamente" });
                    } else {
                        return res
                            .status(404)
                            .send({ message: "no existe ninguna noticia con ese id" });
                    }
                });
            }
        }
    );
}

function getNoticiaById(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM noticias WHERE id=${id}`;
    conexion.query(query, function(err, result) {
        if (err) return res.status(500).send({ message: err });
        if (result) {
            return res.status(200).send({ result });
        }
    });
}

function searchNoticias(req, res) {
    let titulo = req.params.titulo;
    let query = `SELECT * FROM noticias WHERE titulo like"%${titulo}%"`;
    console.log(query);
    conexion.query(query, function(err, result) {
        if (err) return res.status(500).send({ message: err });
        if (result) {
            return res.status(200).send({ result });
        }
    });
}

module.exports = {
    getNoticias,
    getNoticiaFoto,
    saveNoticia,
    deleteNoticia,
    updateNoticia,
    getNoticiaById,
    searchNoticias
};