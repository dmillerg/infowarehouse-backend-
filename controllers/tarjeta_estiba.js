const conexion = require("../database/database");
const { json } = require("body-parser");

function getTarjetas(req, res) {
  // var id_post = req.params.id_post;
  // var query = ``;
  // if (id_post > -1) {
  //   query += ` WHERE id_post=${id_post} `;
  // }
  // query += `ORDER BY fecha DESC`;

  conexion.query(
    `SELECT * FROM tarjeta_estiba `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return res.status(500).send(error);
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).send({ documents: "no hay trajetas estibas" });
      }
    }
  );
}

function saveTarjetaEstiba(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var id = -1;
        var codigo = req.body.codigo;
        var producto_generico = req.body.producto_generico;
        var producto_especifico = req.body.producto_especifico;
        var precio_unitario = req.body.precio_unitario;
        conexion.query(
          `INSERT INTO tarjeta_estiba(codigo, producto_generico, producto_especifico, precio_unitario) VALUES ("${codigo}", "${producto_generico}", "${producto_especifico}", "${precio_unitario}")`,
          function (error, results, fields) {
            if (error) return res.status(500).send({ message: error });
            if (results) {
              return res
                .status(201)
                .send({ message: "tarjeta estiba guardada correctamente" });
            }
          }
        );
      }
    }
  );
}

function deleteTarjetaEstiba(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.query.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        const codigo = req.params.codigo;
        let query = `SELECT * FROM tarjeta_estiba WHERE codigo="${codigo}"`;
        console.log(query);
        conexion.query(query, function (err, result) {
          if (err) return res.status(500).send({ message: err });
          if (result) {
            conexion.query(
              `DELETE FROM tarjeta_estiba WHERE codigo = "${codigo}"`,
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

function getTarjetaEstibaByCodigo(req, res) {
  let codigo = req.params.codigo;
  let query = `SELECT * FROM tarjeta_estiba WHERE codigo=${codigo}`;
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
  getTarjetas,
  deleteTarjetaEstiba,
  saveTarjetaEstiba,
  getTarjetaEstibaByCodigo,
};
