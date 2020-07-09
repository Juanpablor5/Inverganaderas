const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

$("#btn_parto").click(function () {
    document.getElementById("btn_registro").style.display = "none";
    document.getElementById("form_parto").style.display = "block";

    const object = [];
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

    let registros = sortId(data_temp);

    object.push({ placeholder: true, text: "Lista de hembras" })
    for (let i = 0; i < registros.length; i++) {
        const hembra = registros[i];
        object.push({ text: hembra.id + " - " + hembra.descripcion })
    }

    hembras_select = new SlimSelect({
        select: "#hembras",
        placeholder: "Lista de hembras",
        searchPlaceholder: "Buscar hembra por registro",
        showSearch: true, // shows search field,
        searchingText: "Buscando...",
        searchText: "No se encontró el congresista buscado",
        closeOnSelect: true,
        data: object
    });
});

const form_parto = document.querySelector('#form_parto');
form_parto.addEventListener('submit', e => {
    const id_hembra = hembras_select.selected() === "Lista de hembras" ? "" : hembras_select.selected();
    const genero = genero_select.selected();
    const fecha = document.querySelector('#fecha-parto').value;
    const registro = document.querySelector('#input_reg_parto').value;

    const nuevo_registro = {
        id_madre: "" ? "" : id_hembra.slice(0, 5),
        genero: genero,
        registro: registro,
        fecha: fecha
    }

    if (id_hembra == "" || genero == "" || (genero == "Hembra" && registro == "")) {
        alert('Por favor complete todos los campos');
    } else if (fecha == "") {
        alert('Por favor elija la fecha de parto');
    } else {
        let data = []
        let hembras
        try {
            data = fs.readFileSync(path.join(__dirname, '../data/registros/Hembras.json'));
            hembras = JSON.parse(data);
        } catch (error) {
            console.log(error, "Error desconocido, pero hay backup :D");
            alert("Hubo un error al registrar, utilizando la última copia de seguridad")
            data = fs.readFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'));
            hembras = JSON.parse(data);
        }

        const encontrado = hembras.find(h => (parseInt(h.id.split("-")[1]) == 999 ? 1000 : parseInt(h.id.split("-")[1])) === parseInt(nuevo_registro.registro))

        if (typeof encontrado !== "undefined") {
            alert("Este numero de registro ya existe")
        } else {
            hembras.forEach(hembra => {
                if (hembra.id === nuevo_registro.id_madre) {
                    if (nuevo_registro.genero === "Macho") {
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

                        const machos = sortId(data_temp);

                        const ult_id = machos[machos.length - 1] ? machos[machos.length - 1].id : "M-000";

                        const id = (s = (parseInt(ult_id.split("-")[1]) + 1).toString(), width = 3, char = '0') => {
                            return (s.length >= width) ? s : (new Array(width).join(char) + s).slice(-width);
                        }

                        const fecha = (inputFormat = nuevo_registro.fecha) => {
                            const sep = inputFormat.split("-")
                            return [sep[2], sep[1], sep[0]].join('-')
                        }

                        hembra.partos.push({ id: "M-" + id(), fecha: fecha() })

                        machos.push({
                            id: "M-" + id(),
                            descripcion: "Nacido el " + fecha(),
                            nacimiento: fecha(),
                            vendido: "",
                            muerte: "",
                            madre: id_hembra
                        });
                        const data_machos = JSON.stringify(machos);
                        const data_hembras = JSON.stringify(hembras);

                        fs.writeFileSync(path.join(__dirname, '../data/registros/Machos.json'), data_machos)

                        fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras.json'), data_hembras)

                        if (machos.length % 5 === 0) {
                            fs.writeFileSync(path.join(__dirname, '../data/registros/Machos-backup.json'), data_machos)
                        }

                        if (hembras.length % 5 === 0) {
                            fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'), data_hembras)
                        }

                        ipcRenderer.send('registro:nuevo', nuevo_registro);
                        return
                    } else {
                        const id = (s = nuevo_registro.registro.toString(), width = 3, char = '0') => {
                            return (s.length >= width) ? s : (new Array(width).join(char) + s).slice(-width);
                        }
                        const fecha = (inputFormat = nuevo_registro.fecha) => {
                            const sep = inputFormat.split("-")
                            return [sep[2], sep[1], sep[0]].join('-')
                        }

                        hembra.partos.push({ id: "H-" + id(), fecha: fecha() })
                        hembras.push({
                            id: "H-" + id(),
                            descripcion: "Nacida el " + fecha(),
                            nacimiento: fecha(),
                            vendido: "",
                            muerte: "",
                            partos: [],
                            madre: id_hembra
                        });
                        const hem_temp = sortId(hembras);

                        const data_hembras = JSON.stringify(hem_temp);

                        fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras.json'), data_hembras)

                        if (hembras.length % 5 === 0) {
                            fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'), data_hembras)
                        }

                        if (id() != 999) {
                            let dir_hem = path.join(__dirname, '../data/img_programa/H-' + id() + "-Nacida_el_" + fecha());
                            if (!fs.existsSync(dir_hem)) {
                                fs.mkdirSync(dir_hem);
                            }
                        }

                        ipcRenderer.send('registro:nuevo', nuevo_registro);
                        return
                    }
                }
            });
        }
    }

    e.preventDefault();
});

const form_hembra = document.querySelector('#form_hembra');
form_hembra.addEventListener('submit', e => {
    const registro = document.querySelector('#input_reg_hembra').value;
    const descripcion = document.querySelector('#input_descripcion').value;

    if (registro == "" || descripcion == "") {
        alert('Por favor complete todos los campos');
    } else {
        const nuevo_registro = {
            registro: registro,
            descripcion: descripcion
        }

        let data = []
        let hembras
        try {
            data = fs.readFileSync(path.join(__dirname, '../data/registros/Hembras.json'));
            hembras = JSON.parse(data);
        } catch (error) {
            console.log(error, "Error desconocido, pero hay backup :D");
            alert("Hubo un error al registrar, utilizando la última copia de seguridad")
            data = fs.readFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'));
            hembras = JSON.parse(data);
        }

        const encontrado = hembras.find(h => parseInt(h.id.split("-")[1]) === parseInt(nuevo_registro.registro))
        if (typeof encontrado !== "undefined") {
            alert("Este numero de registro ya existe");
        } else {
            ipcRenderer.send('hembra:nuevo', nuevo_registro);

            const id = (s = nuevo_registro.registro.toString(), width = 3, char = '0') => {
                return (s.length >= width) ? s : (new Array(width).join(char) + s).slice(-width);
            }
            hembras.push({
                id: "H-" + id(),
                descripcion: nuevo_registro.descripcion,
                vendido: "",
                muerte: "",
                partos: []
            });

            const hem_temp = sortId(hembras);

            const data_hembras = JSON.stringify(hem_temp);

            fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras.json'), data_hembras)

            if (hembras.length % 5 === 0) {
                fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'), data_hembras)
            }

            const dir_hem = path.join(__dirname, '../data/img_programa/H-' + id() + "-" + nuevo_registro.descripcion.replace(/\s/g, '_'));
            if (!fs.existsSync(dir_hem)) {
                fs.mkdirSync(dir_hem);
            }

            return
        }
    }
    e.preventDefault();
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