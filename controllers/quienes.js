const conexion = require("../database/database");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");

function getQuienes(req, res) {
  var limit = req.params.limit;
  var query = ``;
  if (limit > 0) {
    query += ` LIMIT ${limit}`;
  }
  query +=` ORDER BY orden ASC`;

  conexion.query(
    `SELECT * FROM quienes ` + query,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return res.status(500).send(error);
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).send({ documents: "no hay personas" });
      }
    }
  );
}

function getQuienesFoto(req, res) {
  try {
    var id = req.params.id;
    conexion.query(
      `SELECT * FROM quienes WHERE id = ${id}`,
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          var path = require("path");
          res.sendFile(path.resolve("public/quienes/" + results[0].imagen));
        } else {
          return res
            .status(404)
            .send({ documento: "no existe ninguna persona con ese id" });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function saveQuienes(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var nombre = req.body.nombre;
        var cargo = req.body.cargo;
        var orden = req.body.orden;
        var foto = { name: null };
        if (req.files) {
          foto = req.files.foto;
          foto_name = nombre.replace(/ /g, "-") + ".jpg";
          console.log(foto_name);
        }
        conexion.query(
          `INSERT INTO quienes(id, nombre, cargo, imagen, orden) VALUES (NULL,"${nombre}", "${cargo}", "${foto_name}", ${orden})`,
          function (error, results, fields) {
            if (error) return res.status(500).send({ message: error });
            if (results) {
              if (req.files) saveFoto(foto, foto_name);
              return res
                .status(201)
                .send({ message: "persona guardada correctamente" });
            }
          }
        );
      }
    }
  );
}

function saveFoto(foto, titulo) {
  if (foto.name != null) {
    foto.mv(`./public/quienes/${titulo}`, function (err) { });
  }
}


function deleteQuienes(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.query.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        const id = req.params.id;
        conexion.query(
          `SELECT * FROM quienes WHERE id=${id}`,
          function (err, result) {
            if (err) return res.status(500).send({ message: err });
            if (result) {
              conexion.query(
                `DELETE FROM quienes WHERE id = ${id}`,
                function (error, results, fields) {
                  if (error) return error;
                  if (results) {
                    deleteFoto(result[0].imagen);
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
  const pathViejo = `./public/quienes/${imagen}`;
  // console.log(pathViejo);
  const fs = require("fs");
  if (fs.existsSync(pathViejo)) {
    console.log("borrado");
    fs.unlinkSync(pathViejo);
  }
  return "borrado correctamente";
}


function updateQuienes(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        // Recogemos un parámetro por la url
        var id = req.params.id;

        // Recogemos los datos que nos llegen en el body de la petición
        var update = req.body;
        var nombre = update.nombre;
        var cargo = update.cargo;
        var orden = update.orden;
        var foto = { name: null };
        if (req.files) foto = req.files.foto;
        console.log(foto.name, "foto");

        // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
        var query = `UPDATE quienes SET nombre="${nombre}", cargo="${cargo}", orden=${orden}`;
        if (foto.name != null)
          query += `,imagen="${nombre.replace(/ /g, "-") + ".jpg"}"`;
        query += `WHERE id = ${id}`;

        conexion.query(query, function (error, results, fields) {
          if (error)
            return res.status(500).send({ message: "error en el servidor" });
          if (results) {
            if (foto.name != null) {
              deleteFoto(nombre.replace(/ /g, "-") + ".jpg");
              saveFoto(foto, nombre.replace(/ /g, "-") + ".jpg");
            }
            return res
              .status(201)
              .send({ message: "actualizado correctamente" });
          } else {
            return res
              .status(404)
              .send({ message: "no existe ninguna persona con ese id" });
          }
        });
      }
    }
  );
}

function getQuienesById(req, res) {
  let id = req.params.id;
  let query = `SELECT * FROM quienes WHERE id=${id}`;
  conexion.query(query, function (err, result) {
    if (err) return res.status(500).send({ message: err });
    if (result) {
      return res
        .status(200)
        .send(result[0]);
    }
  });
}

module.exports = {
  getQuienes,
  saveQuienes,
  deleteQuienes,
  updateQuienes,
  getQuienesById,
  getQuienesFoto
};
