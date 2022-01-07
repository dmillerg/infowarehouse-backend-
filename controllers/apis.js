function getApis(req, res) {
    const api = require('./../url/url');
    const apis = [];
    var item = '';
    api.stack.forEach(element => {
        apis.push({ method: element.route.methods, ruta: element.route.path });
        let method = '';
        if (element.route.methods.get) {
            method = 'GET';
        } else if (element.route.methods.post) {
            method = 'POST';
        } else if (element.route.methods.put) {
            method = 'PUT';
        } else if (element.route.methods.delete) {
            method = 'DELETE';
        }

        // console.log(element.route.path.indexOf('/:'), '     ', element.route.path);
        if (element.route.path.indexOf(':') > 0 && (method == 'GET' || method == 'DELETE')) {
            var arg = element.route.path.substring(element.route.path.indexOf(':') + 1, element.route.path.length);
            var ruta = element.route.path.substring(0, element.route.path.indexOf(':'));
            var idform = ruta.split('/')[1] + 'form';
            var idIn = ruta.split('/')[1] + 'in';
            var idbtn = ruta.split('/')[1] + 'btn';
            item += `<form id="${idform}" action="apis/${ruta}" method="${method}">
            <div class="form-in"><label>Metodo: ${method}</label></div>
            <div class="form-in"><a href="${element.route.path}">Url: ${element.route.path}</a></div>
            <div class="form-in"><input type="text" id="${idIn}" name="" placeholder="${arg}..."></div>
            <div class="form-in"><button id="${idbtn}" type="button" value="enviar">Enviar Solicitud</div>
        </form>
        <script>
        document.getElementById('${idbtn}').addEventListener('click', () => {
            document.getElementById('${idform}').action ='apis/'+ ${ruta} + document.getElementById('${idIn}').value;
            document.getElementById('${idform}').submit();
        });
        </script>`;
        } else if (method == 'GET') {
            var arg = element.route.path.substring(element.route.path.indexOf(':') + 1, element.route.path.length);
            var ruta = element.route.path;
            var idform = ruta.split('/')[1] + 'form';
            var idIn = ruta.split('/')[1] + 'in';
            var idbtn = ruta.split('/')[1] + 'btn';
            item += `<form id="${idform}" action="apis/${ruta}" method="${method}">
            <div class="form-in"><label>Metodo: ${method}</label></div>
            <div class="form-in"><a href="${element.route.path}">Url: ${element.route.path}</a></div>
            <div class="form-in"><a type="text" href="apis/${element.route.path}" id="${idIn}" ></a></div>
            <div class="form-in"><button id="${idbtn}" type="button" value="enviar">Enviar Solicitud</div>
        </form>
        <script>
        document.getElementById('${idbtn}').addEventListener('click', () => {
            document.getElementById('${idIn}').click();
        });
        </script>`
        } else
            var arg = element.route.path.substring(element.route.path.indexOf(':') + 1, element.route.path.length);
        var ruta = element.route.path;
        var idform = ruta.split('/')[1] + 'form';
        var idIn = ruta.split('/')[1] + 'in';
        var idbtn = ruta.split('/')[1] + 'btn';
        item += `<form id="${idform}" action="apis/${ruta}" method="${method}">
        <div class="form-in"><label>Metodo: ${method}</label></div>
        <div class="form-in"><a href="${element.route.path}" disabled>Url: ${element.route.path}</a></div>
        <div class="form-in"><textarea type="text" id="${idIn}" name="" placeholder="${arg}..." rows="1" disabled></textarea></div>
        <div class="form-in"><button id="${idbtn}" type="button" value="enviar" disabled>Enviar Solicitud</div>
    </form>
    <script>
    document.getElementById('${idbtn}').addEventListener('click', () => {
        document.getElementById('${idform}').action ='apis/'+ ${ruta};
        document.getElementById('${idform}').submit();
    });
    </script>`
    });
    const resp = `
    <style type="text/css">
    form {
        width: 95%;
        height: 65px;
        margin: auto;
        margin-block: 10px;
        border-radius: 0.5em;
        background-color: #08f;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-family: Arial, Helvetica, sans-serif;
    }

    form:hover{
        transform: scale(1.05);
        transition: all 0.3s;
    }

    .form-in {
        margin-inline: 10px;
    }

    input, textarea {
        border: none;
        padding: 5px;
        border-radius: 0.5em;
        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.2);
    }

    label, a {
        text-shadow: 2px 2px 6px #000000;
    }

    #arg {
        padding-left: 10px;
    }

    button{
        padding: 8px;
        font-weight: 500;
        background-color: rgba(0, 0, 0, 0.4);
        color: white;
        border: none;
        border-radius: 0.5em;
        box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }

    button:hover{
        background-color: rgba(0, 0, 0, 0.2);
        transition: all 0.3s;
    }

    .example-loading-shade {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0px;
        right: 0;
        background: rgb(27, 27, 27);
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    :disabled{
        cursor: not-allowed;
    }

    .container{
        width: 65%;
    }

    a{
        text-decoration: none;
        color: white;
    }

    a:hover{
        color: rgb(210,210,210);
        transition: all 0.3s;
    }
  </style>
  <div class="example-loading-shade">
  <div class="container" style="text-align: center; color: white;font-family: Arial, Helvetica, sans-serif;">
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-laptop" viewBox="0 0 16 16">
  <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
</svg>
  <h1>Bienvenido al servidor de APis del ICEM</h1>
  <p>Solo no se pueden probar desde aqui las api de tipo POST, que esta en desarrollo</p>
    <div id="lista" class="lista" name="lista" style="overflow-y: scroll;height: 350px">
        ${item}
    </div>
    </div>
    </div>
   `
    return res.status(200).send(resp);
}

module.exports = {
    getApis,
};