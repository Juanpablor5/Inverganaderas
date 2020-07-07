const fs = require('fs');
const path = require('path');

let object = [];

let data = []
let data_temp
try {
    data = fs.readFileSync(path.join(__dirname, '../data/registros/Hembras.json'));
    data_temp = JSON.parse(data);
} catch (error) {
    console.log(error, "Error desconocido, pero hay backup :D");
    alert("Hubo un error al registrar, utilizando la última copia de seguridad")
    data = fs.readFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'));
    data_temp = JSON.parse(data);
}

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

let hem_selec = []

$("#hembras_historia").change(function () {
    const hem_selected = hembras_select_historia.selected();
    if (hem_selected.includes("999")) {
        document.getElementById("edit_num_reg").style.display = "block";
        document.getElementById('tabla_historia').innerHTML = "";
        document.getElementById("table_more_actions").style.display = "none";
        return
    }

    document.getElementById("edit_desc_reg").style.display = "none";
    document.getElementById("form_reg_muer").style.display = "none";
    document.getElementById("form_reg_vent").style.display = "none";

    document.getElementById("edit_num_reg").style.display = "none";
    document.getElementById("table_more_actions").style.display = "block";

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

        hem_selec = registros.find(h => parseInt(h.id.split("-")[1]) === parseInt(id_hembra))

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

        let b_madre = ""
        if (hem_selec.madre) {
            b_madre = `<br><br><b>Madre: &nbsp;</b> ${hem_selec.madre}`
        }

        tr_info.innerHTML = `
                <th scope="row">Información</th>
                <td>
                    <p>
                        <br>
                        <b>Descripción: &nbsp;</b>${hem_selec.descripcion}
                        <br>
                        <br>
                        <b>Estado actual: &nbsp;</b>${hem_selec.muerte === "" ? "Viva" : "Muerta el " + hem_selec.muerte}
                        <br>
                        <br>
                        <b>Vendido: &nbsp;</b>${hem_selec.vendido === "" ? "No" : hem_selec.vendido}
                        ${b_madre}
                    </p>
                </td>`;

        const imagenes = imagenes_hem(files, ruta);

        tr_imagenes.innerHTML = `
                <th scope="row">Imágenes</th>
                <td><br>${imagenes.outerHTML}</td>`;

        // Cada fila de tabla de historia
        tbody.appendChild(tr_partos);
        tbody.appendChild(tr_info);
        tbody.appendChild(tr_imagenes);

        table.appendChild(tbody);

        document.getElementById('tabla_historia').innerHTML = "";
        document.getElementById('tabla_historia').appendChild(table);
    });
});

const edit_num_reg = document.querySelector('#edit_num_reg');
edit_num_reg.addEventListener('submit', e => {
    const hem_selected = hembras_select_historia.selected();
    const registro = document.querySelector('#input_ed_reg').value;

    const encontrado = registros.find(h => parseInt(h.id.split("-")[1]) === parseInt(registro))

    if (typeof encontrado !== "undefined") {
        alert("Este numero de registro ya existe")
    } else {
        const id = (s = registro, width = 3, char = '0') => {
            return (s.length >= width) ? s : (new Array(width).join(char) + s).slice(-width);
        }

        let to_chng = registros.find(h => h.id === hem_selected.slice(0, 5) && h.descripcion === hem_selected.slice(8, (hem_selected.length + 1)));

        let madre = registros.find(h => h.id === to_chng.madre.slice(0, 5)).partos.find(p => p.id === hem_selected.slice(0, 5) && p.fecha === hem_selected.slice(18, (hem_selected.length + 1)))

        to_chng.id = "H-" + id();
        madre.id = "H-" + id();

        let data_hembras = JSON.stringify(registros);

        fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras.json'), data_hembras)

        if (registros.length % 5 === 0) {
            fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'), data_hembras)
        }

        let dir_hem = path.join(__dirname, '../data/img_programa/H-' + id() + "-Nacida_el_" + madre.fecha);
        if (!fs.existsSync(dir_hem)) {
            fs.mkdirSync(dir_hem);
        }

    }
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
            div.innerHTML += `<img src="${ruta + "/" + img}" width="100%">`
            div.innerHTML += `<br>`
            div.innerHTML += `<br>`
            div.innerHTML += `<br>`
        });
        return div
    }
}