const conexion = require("../database/database");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");

function getPosts(req, res) {
  var id_producto = req.params.id_producto;
  var query = ``;
  if (id_producto > -1) {
    query += ` WHERE id_producto=${id_producto} `;
  }
  query += `ORDER BY fecha DESC`;

  conexion.query(
    `SELECT * FROM posts ` + query,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return res.status(500).send(error);
      }
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).send({ documents: "no hay posts" });
      }
    }
  );
}

function savePosts(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var id = -1;
        var alias = req.body.alias;
        var correo = req.body.correo;
        var comentario = req.body.comentario;
        var fecha = new Date();
        var id_producto = req.body.id_producto;
        console.log('so', id_producto);
        conexion.query(
          `INSERT INTO posts(id, alias, correo, comentario, fecha, id_producto) VALUES (NULL,"${alias}", "${correo}", "${comentario}", "${fecha}", "${id_producto}")`,
          function (error, results, fields) {
            if (error) return res.status(500).send({ message: error });
            if (results) {
              return res
                .status(201)
                .send({ message: "posts guardado correctamente" });
            }
          }
        );
      }
    }
  );
}

function deletePosts(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.query.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        const id = req.params.id;
        conexion.query(
          `SELECT * FROM posts WHERE id=${id}`,
          function (err, result) {
            if (err) return res.status(500).send({ message: err });
            if (result) {
              conexion.query(
                `DELETE FROM posts WHERE id = ${id}`,
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

function searchRespuestas(req, res) {
  let idpost = req.params.idpost;
  conexion.query(`SELECT * FROM respuesta WHERE id_post=${idpost}`, function(error, result, field){
    if(error){
      return res.status(500).send({message: error});
    }
    if(result){
      return res.status(200).send(result);
    }
  })
}

module.exports = {
  getPosts,
  savePosts,
  deletePosts,
  searchRespuestas,
};
