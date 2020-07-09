let macho_selec = []

let object = [];

let data = []
let data_temp
try {
    data = fs.readFileSync(path.join(__dirname, '../data/registros/Machos.json'));
    data_temp = JSON.parse(data);
} catch (error) {
    console.log(error, "Error desconocido, pero hay backup :D");
    alert("Hubo un error al registrar, utilizando la última copia de seguridad")
    data = fs.readFileSync(path.join(__dirname, '../data/registros/Machos-backup.json'));
    data_temp = JSON.parse(data);
}

const registros = sortId(data_temp);

object.push({ placeholder: true, text: "Lista de machos" })
for (let i = 0; i < registros.length; i++) {
    const macho = registros[i];
    object.push({ text: macho.id + " - " + macho.descripcion })
}

var machos_select_historia = new SlimSelect({
    select: "#machos_historia",
    searchPlaceholder: "Buscar macho por registro",
    showSearch: true, // shows search field,
    searchingText: "Buscando...",
    searchText: "No se encontró el macho buscado",
    closeOnSelect: true,
    data: object
});

$("#btn_buscar_macho").click(function () {
    document.getElementById("buscar_macho").style.display = "block";
    document.getElementById("botones_select").style.display = "none";

    $("#machos_historia").change(function () {
        const macho_selected = machos_select_historia.selected();

        document.getElementById("edit_desc_reg").style.display = "none";
        document.getElementById("form_reg_muer").style.display = "none";
        document.getElementById("form_reg_vent").style.display = "none";

        document.getElementById("edit_num_reg").style.display = "none";
        document.getElementById("table_more_actions").style.display = "block";

        let table = document.createElement('table');
        table.className = "table table-hover table-light";
        table.style = "width:80%; margin-left: auto; margin-right: auto; border-style: outset; background: rgba(255,255,255,0.8);";

        let id_hembra
        if (macho_selected === "Lista de machos") {
            alert("Seleccione una hembra para buscar")
            return
        } else {
            id_hembra = macho_selected.slice(2, 5);
        }

        macho_selec = registros.find(h => parseInt(h.id.split("-")[1]) === parseInt(id_hembra))

        let tbody = document.createElement("tbody");

        // Table row de la historia
        let tr_info = document.createElement("tr");

        // Table header
        let b_madre = ""
        if (macho_selec.madre) {
            b_madre = `<b>Madre: &nbsp;</b> ${macho_selec.madre}
            <br><br><b>Fecha de nacimiento: &nbsp;</b> ${macho_selec.nacimiento}`
        }

        tr_info.innerHTML = `
                    <th scope="row" style="width:20%;">Información</th>
                    <td>
                        <p>
                            ${b_madre}
                            <br>
                            <br>
                            <b>Descripción: &nbsp;</b>${macho_selec.descripcion}
                            <br>
                            <br>
                            <b>Estado actual: &nbsp;</b>${macho_selec.muerte === "" ? "Vivo" : "Muerto el " + macho_selec.muerte}
                            <br>
                            <br>
                            <b>Vendido: &nbsp;</b>${macho_selec.vendido === "" ? "No" : macho_selec.vendido}
                        </p>
                    </td>`;

        // Cada fila de tabla de historia
        tbody.appendChild(tr_info);

        table.appendChild(tbody);

        document.getElementById('tabla_historia').innerHTML = "";
        document.getElementById('tabla_historia').appendChild(table);

        //Acciones del macho seleccionada
        accionesMacho();
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
});