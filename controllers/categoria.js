const conexion = require("../database/database");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");

function getCategoria(req, res) {
  var id = req.params.id;
  var limit = req.params.limit;
  var query = ``;
  if (limit > 0) {
    query += ` LIMIT ${limit}`;
  }

  conexion.query(
    `SELECT * FROM categorias ` + query,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return res.status(500).send(error);
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).send({ documents: "no hay categorias" });
      }
    }
  );
}

function saveCategoria(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var id = -1;
        console.log(req.body);
        var nombre = req.body.nombre;
        conexion.query(
          `INSERT INTO categorias(id, nombre) VALUES (NULL,"${nombre}")`,
          function (error, results, fields) {
            if (error) return res.status(500).send({ message: error });
            if (results) {
              return res
                .status(201)
                .send({ message: "categoria guardado correctamente" });
            }
          }
        );
      }
    }
  );
}

function deleteCategoria(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.query.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        const id = req.params.id;
        conexion.query(
          `SELECT * FROM categorias WHERE id=${id}`,
          function (err, result) {
            if (err) return res.status(500).send({ message: err });
            if (result) {
              conexion.query(
                `DELETE FROM categorias WHERE id = ${id}`,
                function (error, results, fields) {
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

function updateCategoria(req, res) {
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

        // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
        var query = `UPDATE categorias SET nombre="${nombre}"`;
        query += `WHERE id = ${id}`;

        conexion.query(query, function (error, results, fields) {
          if (error)
            return res.status(500).send({ message: "error en el servidor" });
          if (results) {
            return res
              .status(201)
              .send({ message: "actualizado correctamente" });
          } else {
            return res
              .status(404)
              .send({ message: "no existe ninguna categoria con ese id" });
          }
        });
      }
    }
  );
}

function getCategoriaById(req, res) {
  let id = req.params.id;
  let query = `SELECT * FROM categorias WHERE id=${id}`;
  conexion.query(query, function (err, result) {
    if (err) return res.status(500).send({ message: err });
    if (result) {
      return res
        .status(200)
        .send({ id: result[0].id, nombre: result[0].nombre });
    }
  });
}

module.exports = {
  getCategoria,
  saveCategoria,
  deleteCategoria,
  updateCategoria,
  getCategoriaById,
};
