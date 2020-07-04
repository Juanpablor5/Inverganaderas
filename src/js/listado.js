const fs = require('fs');
const path = require('path');

let data = fs.readFileSync(path.join(__dirname, '../data/registros/Hembras.json'));
let data_temp = JSON.parse(data);

const registros = sortId(data_temp);

let table = document.createElement('table');
table.className = "table table-hover table-light table-striped";
table.style = "width:80%; margin-left: auto; margin-right: auto; border-style: outset; margin-top: 25px; background: rgba(255,255,255,0.8);";

let thead = document.createElement("thead");
thead.innerHTML = `                    
    <tr>
        <th scope="col" style="width:25px; text-align:center;">#</th>
        <th scope="col" style="width:108px; text-align:center;">No. registro</th>
        <th scope="col" style="width:300px; text-align:center;">Descripción</th>
        <th scope="col" style="text-align:center;">Más información (partos, imágenes, etc)</th>
    </tr>`;

table.appendChild(thead)

let tbody = document.createElement("tbody");

for (let i = 0; i < registros.length; i++) {
    const registro = registros[i];

    let tr = document.createElement("tr");

    const tabla_par = tabla_parto(registro.partos);

    let b_madre = ""

    if(registro.madre) {
        b_madre = `<br><br><b>Madre: &nbsp;</b> ${registro.madre}`
    }

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
                    <b>Partos: </b>
                        ${tabla_par.outerHTML}
                    <b>Estado actual: &nbsp;</b>${registro.muerte === "" ? "Viva" : "Muerta"}
                        ${b_madre}
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

for (let i = 0; i < coll.length; i++) {
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

function tabla_parto(partos) {
    if (partos.length != 0) {
        let table_parto = document.createElement('table');
        table_parto.className = "table table-hover table-light table-striped";
        table_parto.style = "width:90%; margin-left: auto; margin-right: auto; border-style: outset; margin-top: 5px; background: rgba(255,255,255,0.8);";

        let thead_parto = document.createElement("thead");
        thead_parto.innerHTML = `                    
    <tr>
        <th scope="col" style="width:25px; text-align:center;">#</th>
        <th scope="col" style="width:108px; text-align:center;">No. registro</th>
        <th scope="col" style="width:108px; text-align:center;">Fecha</th>
        <th scope="col" style="width:108px; text-align:center;">Género</th>
    </tr>`;

        table_parto.appendChild(thead_parto)

        let tbody_parto = document.createElement("tbody");

        for (let i = 0; i < partos.length; i++) {
            const parto = partos[i];
            const sep = parto.id.split("-");
            let tr_parto = document.createElement("tr");

            tr_parto.innerHTML = `                    
        <tr>
            <th scope="row" style="text-align:center;">${i + 1}</th>
            <th scope="row" style="text-align:center;">${parto.id}</th>
            <td style="text-align:center;">${parto.fecha}</td>
            <td style="text-align:center;">${sep[0] === 'M' ? "Macho" : "Hembra"}</td>
        </tr>`;
            tbody_parto.appendChild(tr_parto);
        }

        table_parto.appendChild(tbody_parto);

        return table_parto;
    } else {
        let table_parto = document.createElement('p');
        table_parto.innerHTML=`Sin partos actualmente`;
        return table_parto
    }
}