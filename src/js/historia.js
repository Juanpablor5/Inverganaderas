const fs = require('fs');
const path = require('path');

let object = [];
let data = fs.readFileSync(path.join(__dirname, '../data/registros/Hembras.json'));
let data_temp = JSON.parse(data);
const registros = sortId(data_temp);

object.push({ placeholder: true, text: "Lista de hembras" })
for (let i = 0; i < registros.length; i++) {
    const hembra = registros[i];
    object.push({ text: hembra.id + " - " + hembra.descripcion })
}

var hembras_select_historia = new SlimSelect({
    select: "#hembras_historia",
    placeholder: "Lista de hembras",
    searchPlaceholder: "Buscar hembra por registro",
    showSearch: true, // shows search field,
    searchingText: "Buscando...",
    searchText: "No se encontró el congresista buscado",
    closeOnSelect: true,
    data: object
});

$("#btn_historia").click(function () {
    const hem_selected = hembras_select_historia.selected();

    const folder = (hem_selected.slice(0, 5) + "-" + hem_selected.slice(8, (hem_selected.length + 1))).replace(/\s/g, '_')
    
    const ruta = path.join(__dirname, '../data/img_programa/' + folder)

    fs.readdir(ruta, (err, files) => {

        let table = document.createElement('table');
        table.className = "table table-hover table-light";
        table.style = "width:80%; margin-left: auto; margin-right: auto; border-style: outset; background: rgba(255,255,255,0.8);";

        let id_hembra
        if (hem_selected === "Lista de hembras") {
            alert("Seleccione una hembra para buscar")
            return
        } else {
            id_hembra = hem_selected.slice(2, 5);
        }

        const hem_selec = registros.find(h => parseInt(h.id.split("-")[1]) === parseInt(id_hembra))

        const tabla_par = tabla_parto(hem_selec.partos);

        let tbody = document.createElement("tbody");

        // Table row de la historia
        let tr_partos = document.createElement("tr");
        let tr_info = document.createElement("tr");
        let tr_imagenes = document.createElement("tr");

        // Table header
        tr_partos.innerHTML = `
                <th scope="row" style="width:20%;">Partos</th>
                <td>${tabla_par.outerHTML}</td>`;

        tr_info.innerHTML = `
                <th scope="row">Información</th>
                <td>
                    <p>
                        <br>
                        <b>Descripción: &nbsp;</b>${hem_selec.descripcion}
                        <br>
                        <br>
                        <b>Estado actual: &nbsp;</b>${hem_selec.muerte === "" ? "Viva" : "Muerta"}
                        <br>
                        <br>
                        <b>Vendido: &nbsp;</b>${hem_selec.vendido === "" ? "No" : hem_selec.vendido}
                    </p>
                </td>`;

        const imagenes = imagenes_hem(files, ruta);

        tr_imagenes.innerHTML = `
                <th scope="row">Imágenes</th>
                <td>${imagenes.outerHTML}</td>`;

        // Cada fila de tabla de historia
        tbody.appendChild(tr_partos);
        tbody.appendChild(tr_info);
        tbody.appendChild(tr_imagenes);

        table.appendChild(tbody);

        document.getElementById('tabla_historia').innerHTML = "";

        document.getElementById('tabla_historia').appendChild(table);
    });
});

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
        table_parto.style = "width:90%; border-style: outset; margin-top: 5px; background: rgba(255,255,255,0.8);";

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
        table_parto.innerHTML = `Sin partos actualmente`;
        return table_parto
    }
}

function imagenes_hem(imagenes, ruta) {
    if (imagenes.length === 0) {
        const parrafo = document.createElement('p');
        parrafo.innerHTML = "<b>La hembra seleccionada no tiene imágenes registradas.</b>"
        return parrafo
    } else {
        const div = document.createElement('div');
        div.style = "margin-left: 10%; margin-right: 10%;"
        imagenes.forEach(img => {
            div.innerHTML += `<img src="${ruta+"/"+img}" width="100%">`
            div.innerHTML += `<br>`
            div.innerHTML += `<br>`
            div.innerHTML += `<br>`
        });
        return div
    }
}