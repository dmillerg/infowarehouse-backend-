const conexion = require("../database/database");
const { json } = require("body-parser");

function getProductos(req, res) {
  conexion.query(
    `SELECT * FROM producto `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return res.status(500).send(error);
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).send({ documents: "no hay productos" });
      }
    }
  );
}

function saveProductos(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var id = -1;
        var nombre = req.body.nombre;
        var precio = req.body.precio;
        var precio_unitario = req.body.codigo;
        conexion.query(
          `INSERT INTO producto(id, nombre, precio, precio_unitario) VALUES (NULL, "${nombre}", "${precio}", "${precio_unitario}")`,
          function (error, results, fields) {
            if (error) return res.status(500).send({ message: error });
            if (results) {
              return res
                .status(201)
                .send({ message: "Producto guardado correctamente" });
            }
          }
        );
      }
    }
  );
}

function deleteProducto(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.query.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        const id = req.params.id;
        let query = `SELECT * FROM producto WHERE id="${id}"`;
        conexion.query(query, function (err, result) {
          if (err) return res.status(500).send({ message: err });
          if (result) {
            conexion.query(
              `DELETE FROM producto WHERE id = ${id}`,
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

function updateProducto(req, res) {
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
        var precio = update.precio;
        var precio_unitario = update.precio_unitario;

        // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
        var query = `UPDATE producto SET nombre="${nombre}", precio="${precio}", precio_unitario="${precio_unitario}"`;
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
              .send({ message: "no existe ningun producto con ese id" });
          }
        });
      }
    }
  );
}

// function getCategoriaById(req, res) {
//   let id = req.params.id;
//   let query = `SELECT * FROM categorias WHERE id=${id}`;
//   conexion.query(query, function (err, result) {
//     if (err) return res.status(500).send({ message: err });
//     if (result) {
//       return res
//         .status(200)
//         .send({ id: result[0].id, nombre: result[0].nombre });
//     }
//   });
// }

module.exports = {
  getProductos,
  deleteProducto,
  saveProductos,
  updateProducto,
};
