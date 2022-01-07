const conexion = require("../database/database");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");

function getMensajes(req, res) {
  let id = req.params.id;
  console.log(id)
  let query = `SELECT * FROM chat WHERE 1 `;
  if (id > -1) {
    query += `AND id>${id} `
  }
  query += ` ORDER BY id ASC`;
  console.log('ssssssss',query);
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).send(error);
    }
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(200).send({ documents: "no hay mensajes" });
    }
  }
  );
}

function getMensajeFoto(req, res) {
  try {
    var id = req.params.id;
    conexion.query(
      `SELECT * FROM chat WHERE id = ${id}`,
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          var path = require("path");
          res.sendFile(path.resolve("public/chat/" + results[0].archivo));
        } else {
          return res
            .status(404)
            .send({ documento: "no existe ningun chat con ese id" });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function saveMensaje(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var id = -1;
        console.log(req.body);
        var body = req.body;
        var nombre = body.nombre;
        var sms = body.sms;
        var fecha = body.fecha;
        var foto_name = "";
        var foto = { name: null };
        if (req.files) {
          foto = req.files.foto;
          foto_name = fecha.toString() + ".jpg";
          console.log(foto_name);
        }

        conexion.query(
          `INSERT INTO chat(id, sms, fecha, nombre, archivo) VALUES (NULL,"${sms}","${fecha}","${nombre}", "${foto_name}")`,
          function (error, results, fields) {
            if (error) return res.status(500).send({ message: error });
            if (results) {
              if (req.files) saveFoto(foto, foto_name);
              return res
                .status(201)
                .send({ message: "mensaje guardado correctamente" });
            }
          }
        );
      }
    }
  );
}

function saveFoto(foto, titulo) {
  if (foto.name != null) {
    foto.mv(`./public/chat/${titulo}`, function (err) { });
  }
}

function deleteMensaje(req, res) {
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.query.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        const id = req.params.id;
        console.log(`SELECT * FROM chat WHERE id=${id}`);
        conexion.query(
          `SELECT * FROM chat WHERE id=${id}`,
          function (err, result) {
            if (err) return res.status(500).send({ message: err });
            if (result.length > 0) {
              if (result[0].archivo != '') {
                deleteFoto(result[0].archivo);
              }
              conexion.query(
                `DELETE FROM chat WHERE id = ${id}`,
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

function deleteFoto(imagen) {
  const pathViejo = `./public/chat/${imagen}`;
  // console.log(pathViejo);
  const fs = require("fs");
  if (fs.existsSync(pathViejo)) {
    console.log("borrado");
    fs.unlinkSync(pathViejo);
  }
  return "borrado correctamente";
}

function updateMensaje(req, res) {
  // Recogemos un parámetro por la url
  conexion.query(
    `SELECT * FROM tokens WHERE token='${req.body.token}'`,
    function (err, result) {
      if (err) {
        return res.status(405).send({ message: "usuario no autenticado" });
      }
      if (result.length > 0) {
        var id = req.params.id;
        console.log("asdasdasdasdasd", req.body.categoria);
        // Recogemos los datos que nos llegen en el body de la petición
        var update = req.body;
        var sms = update.sms;
        var fecha = update.fecha;
        var nombre = update.nombre;
        var foto = { name: null };
        if (req.files) foto = req.files.foto;
        console.log(foto.name, "foto");
        // Buscamos por id y actualizamos el objeto y devolvemos el objeto actualizado
        var query = `UPDATE chat SET sms="${sms}",fecha="${fecha}", nombre="${nombre}"`;
        if (foto.name != null)
          query += `,archivo="${id.toString().replace(/ /g, "-")}.jpg"`;
        query += `WHERE id = ${id}`;

        conexion.query(query, function (error, results, fields) {
          if (error)
            return res.status(500).send({ message: "error en el servidor" });
          if (results) {
            if (foto.name != null) {
              deleteFoto(title + ".jpg");
              saveFoto(foto, title);
            }
            return res
              .status(201)
              .send({ message: "actualizado correctamente" });
          } else {
            return res
              .status(404)
              .send({ message: "no existe ningun mensaje con ese id" });
          }
        });
      }
    }
  );
}

function getMensajeById(req, res) {
  let id = req.params.id;
  let query = `SELECT * FROM chat WHERE id=${id}`;
  conexion.query(query, function (err, result) {
    if (err) return res.status(500).send({ message: err });
    if (result) {
      return res.status(200).send({ result });
    }
  });
}

function downloadFile(req, res) {
  let nombre = req.query.nombre;
  var path = require("path");
  var file = path.resolve("public/chat/" + nombre);
  res.status(200).download(file); // Set disposition and send it.
};

module.exports = {
  getMensajes,
  getMensajeFoto,
  saveMensaje,
  deleteMensaje,
  updateMensaje,
  getMensajeById,
  downloadFile,
};
