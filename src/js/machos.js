const fs = require('fs');
const path = require('path');

let data = []
let data_temp
try {
    data = fs.readFileSync(path.join(__dirname, '../data/registros/Machos.json'));
    data_temp = JSON.parse(data);
} catch (error) {
    console.log(error, "Error desconocido, pero hay backup :D");
    alert("Hubo un error al generar el listado, utilizando la última copia de seguridad")
    data = fs.readFileSync(path.join(__dirname, '../data/registros/Machos-backup.json'));
    data_temp = JSON.parse(data);
}

const registros = sortId(data_temp)

let table = document.createElement('table');
table.className = "table table-hover table-light table-striped";
table.style = "width:80%; margin-left: auto; margin-right: auto; border-style: outset; margin-top: 25px; background: rgba(255,255,255,0.9);";

let thead = document.createElement("thead");
thead.innerHTML = `                    
    <tr>
        <th scope="col" style="width:25px; text-align:center;">#</th>
        <th scope="col" style="width:108px; text-align:center;">No. registro</th>
        <th scope="col" style="width:300px; text-align:center;">Descripción</th>
        <th scope="col" style="text-align:center;">Más información</th>
    </tr>`;

table.appendChild(thead)

let tbody = document.createElement("tbody");

for (let i = 0; i < registros.length; i++) {
    const registro = registros[i];

    let tr = document.createElement("tr");

    tr.innerHTML = `                    
    <tr>
        <th scope="row" style="text-align:center;">${i + 1}</th>
        <th scope="row" style="text-align:center;">${registro.id}</th>
        <td class="text-justify">${registro.descripcion}</td>
        <td>
            <button type="button" class="collapsible">Click para más información</button>
            <div class="content">
                <p>
                    <br>
                    <b>Estado actual: &nbsp;</b>${registro.muerte === "" ? "Vivo" : "Muerto el " + registro.muerte}
                    <br>
                    <br>
                    <b>Vendido: &nbsp;</b>${registro.vendido === "" ? "No" : registro.vendido}
                    <br>
                    <br>
                    <b>No. registro de madre: &nbsp;</b>${registro.madre}
                </p>
            </div>
        </td>
    </tr>`;
    tbody.appendChild(tr);
}

table.appendChild(tbody);

document.getElementById('tabla').innerHTML = "";

document.getElementById('tabla').appendChild(table);

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

function sortId(array, order) {
    return array.sort(order === 'DESC'
        ? function (b, a) {
            a = a.trackingNo.slice(2, 5);
            b = b.trackingNo.slice(2, 5);
            return isNaN(b) - isNaN(a) || a > b || -(a < b);
        }
        : function (a, b) {
            a = a.id.slice(2, 5);
            b = b.id.slice(2, 5);
            return isNaN(a) - isNaN(b) || a > b || -(a < b);
        });
}
