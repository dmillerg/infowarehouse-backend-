const conexion = require("../database/database");
const { json } = require("body-parser");

function getFacturaProducto(req, res) {
  conexion.query(
    `SELECT * FROM factura_producto WHERE no_factura=${req.params.no}`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return res.status(500).send(error);
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).send({ documents: "no hay producto para esa factura" });
      }
    }
  );
}

function saveFacturaProducto(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var no_factura = req.body.no_factura;
        var codigo_producto = req.body.codigo_producto;
        var cantidad = req.body.cantidad;
        conexion.query(
          `INSERT INTO factura_producto(id, no_factura, codigo_producto, cantidad) VALUES (NULL, "${no_factura}", "${codigo_producto}", "${cantidad}")`,
          function (error, results, fields) {
            if (error) return res.status(500).send({ message: error });
            if (results) {
              return res
                .status(201)
                .send({ message: "producto guardado dentro de la factura " });
            }
          }
        );
      }
    }
  );
}

function deleteFactura(req, res) {
  // conexion.query(
  //   `SELECT * FROM tokens WHERE token='${req.query.token}'`,
  //   function (err, result) {
  //     if (err) {
  //       return res.status(405).send({ message: "usuario no autenticado" });
  //     }
  //     if (result.length > 0) {
  const codigo = req.params.codigo;
  let query = `SELECT * FROM factura WHERE codigo="${codigo}"`;
  console.log(query);
  conexion.query(query, function (err, result) {
    if (err) return res.status(500).send({ message: err });
    if (result) {
      conexion.query(
        `DELETE FROM factura WHERE codigo = "${codigo}"`,
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
  // }
  //   }
  // );
}

// function updateCategoria(req, res) {
//   conexion.query(
//     `SELECT * FROM tokens WHERE token='${req.body.token}'`,
//     function (err, result) {
//       if (err) {
//         return res.status(405).send({ message: "usuario no autenticado" });
//       }
//       if (result.length > 0) {
//         // Recogemos un parámetro por la url
//         var id = req.params.id;

//         // Recogemos los datos que nos llegen en el body de la petición
//         var update = req.body;
//         var nombre = update.nombre;

//         // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
//         var query = `UPDATE categorias SET nombre="${nombre}"`;
//         query += `WHERE id = ${id}`;

//         conexion.query(query, function (error, results, fields) {
//           if (error)
//             return res.status(500).send({ message: "error en el servidor" });
//           if (results) {
//             return res
//               .status(201)
//               .send({ message: "actualizado correctamente" });
//           } else {
//             return res
//               .status(404)
//               .send({ message: "no existe ninguna categoria con ese id" });
//           }
//         });
//       }
//     }
//   );
// }

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
  getFacturaProducto,
  deleteFactura,
  saveFacturaProducto,
};
