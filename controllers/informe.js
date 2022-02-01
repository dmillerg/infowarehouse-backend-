const conexion = require("../database/database");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");
const { format } = require("../database/database");

function getInforme(req, res) {
  // var id_post = req.params.id_post;
  // var query = ``;
  // if (id_post > -1) {
  //   query += ` WHERE id_post=${id_post} `;
  // }
  // query += `ORDER BY fecha DESC`;
  conexion.query(
    `SELECT * FROM informe_recepcion`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return res.status(500).send(error);
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).send({ documents: "no hay informes" });
      }
    }
  );
}

function getInformeByYear(req, res) {
  conexion.query(
    `SELECT * FROM informe_recepcion WHERE anno=${req.params.anno}`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return res.status(500).send(error);
      }
      if (results) {
        return res.status(200).json(results);
      } 
    }
  );
}

function saveinforme(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var no = req.body.no;
        var empresa = req.body.empresa;
        var almacen = req.body.almacen;
        var codigo = req.body.codigo;
        var fecha = new Date();
        var recepcionado_por = req.body.recepcionado_por;
        var entidad_suministradora = req.body.entidad_suministradora;
        var factura = req.body.factura;
        conexion.query(
          `INSERT INTO informe_recepcion(no, empresa, almacen, codigo, fecha, recepcionado_por, entidad_suministradora, factura, anno) VALUES ("${no}", "${empresa}", "${almacen}", "${codigo}", "${fecha}", "${recepcionado_por}", "${entidad_suministradora}", "${factura}", "${new Date().getFullYear()}")`,
          function (error, results, fields) {
            if (error) return res.status(500).send({ message: error });
            if (results) {
              return res
                .status(201)
                .send({ message: "informe guardado correctamente" });
            }
          }
        );
      }
    }
  );
}

function deleteRespuesta(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.query.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        const id = req.params.id;
        conexion.query(
          `SELECT * FROM respuesta WHERE id=${id}`,
          function (err, result) {
            if (err) return res.status(500).send({ message: err });
            if (result) {
              conexion.query(
                `DELETE FROM respuesta WHERE id = ${id}`,
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
  getInforme,
  saveinforme,
  deleteRespuesta,
  getInformeByYear,
};
