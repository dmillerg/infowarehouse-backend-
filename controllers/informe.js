const conexion = require("../database/database");
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
        var anno = req.body.anno;
        var no_anno = req.body.no_anno;
        var factura = req.body.factura;
        conexion.query(
          `INSERT INTO informe_recepcion(no, empresa, almacen, codigo, fecha, recepcionado_por, entidad_suministradora, factura, anno, no_anno) VALUES ("${no}", "${empresa}", "${almacen}", "${codigo}", "${fecha}", "${recepcionado_por}", "${entidad_suministradora}", "${factura}", "${anno}", "${no_anno}")`,
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

function getLastNumber(req, res) {
  const year = new Date().getFullYear();
  let query = `SELECT * FROM informe_recepcion WHERE anno>=${year} ORDER BY no DESC`;
  conexion.query(query, function (error, result) {
    if (error) {
      return res.status(500).send({ message: error });
    }
    if (result) {
      return res.status(200).send(result);
    }
  })
}

module.exports = {
  getInforme,
  saveinforme,
  getInformeByYear,
  getLastNumber,
};
