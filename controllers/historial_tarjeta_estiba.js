const conexion = require("../database/database");
const { json } = require("body-parser");

function getHistorialTarjetaEstiba(req, res) {
  var codigo = req.params.codigo;

  conexion.query(
    `SELECT * FROM historial_tarjeta_estiba WHERE codigo_estiba="${codigo}"`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return res.status(500).send(error);
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).send({ documents: "no hay tarjetas estibas" });
      }
    }
  );
}

function saveHistorialTarjetaEstiba(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var fecha = req.body.fecha;
        var clave = req.body.clave;
        var no = req.body.no;
        var entrada = req.body.entrada;
        var salida = req.body.salida;
        var saldo = 0;
        var firma = req.body.firma;
        var codigo_estiba = req.body.codigo_estiba;
        console.log(req.body);
        conexion.query(`SELECT * FROM historial_tarjeta_estiba WHERE codigo_estiba="${codigo_estiba}"`, function (errorr, resultt) {
          if (errorr) return res.status(500).send({ message: errorr });
          if (resultt.length > 0) {
            saldo = parseInt(resultt[resultt.length - 1].saldo) + parseInt(entrada != '-' ? entrada : 0) - parseInt(salida != '-' ? salida : 0);
            conexion.query(
              `INSERT INTO historial_tarjeta_estiba( fecha, clave, no, entrada, salida, saldo, firma, codigo_estiba) VALUES ("${fecha}", "${clave}", "${no}", "${entrada}", "${salida}", "${saldo}", "${firma}", "${codigo_estiba}")`,
              function (error, results, fields) {
                if (error) return res.status(500).send({ message: error });
                if (results) {
                  return res
                    .status(201)
                    .send({ message: "historial de tarjeta estiba guardado correctamente" });
                }
              }
            );
          } else {
            saldo = entrada;
            conexion.query(
              `INSERT INTO historial_tarjeta_estiba( fecha, clave, no, entrada, salida, saldo, firma, codigo_estiba) VALUES ("${fecha}", "${clave}", "${no}", "${entrada}", "${salida}", "${saldo}", "${firma}", "${codigo_estiba}")`,
              function (error, results, fields) {
                if (error) return res.status(500).send({ message: error });
                if (results) {
                  return res
                    .status(201)
                    .send({ message: "historial de tarjeta estiba guardado correctamente" });
                }
              }
            );
          }
        });
      }
    }
  );
}

function deleteHistorialTarjetaEstiba(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.query.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        const id = req.params.id;
        const codigo = req.query.codigo;
        let query = `SELECT * FROM historial_tarjeta_estiba WHERE codigo="${codigo}" AND id=${id}`;
        console.log(query);
        conexion.query(query, function (err, result) {
          if (err) return res.status(500).send({ message: err });
          if (result) {
            conexion.query(
              `DELETE FROM historial_tarjeta_estiba WHERE codigo = "${codigo}" AND id=${id}`,
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
  getHistorialTarjetaEstiba,
  deleteHistorialTarjetaEstiba,
  saveHistorialTarjetaEstiba,
  getTarjetaEstibaByCodigo,
};
