const fs = require('fs');
const path = require('path');

function accionesHembra() {
    $("#btn_edit_desc").click(function () {
        document.getElementById("edit_desc_reg").style.display = "block";
        document.getElementById('tabla_historia').innerHTML = "";
        document.getElementById("table_more_actions").style.display = "none";

        const edit_desc_reg = document.querySelector('#edit_desc_reg');
        edit_desc_reg.addEventListener('submit', e => {
            const descripcion = document.querySelector('#input_edit_desc').value;

            if (descripcion === "") {
                e.preventDefault()
                alert("Debe escribir la nueva descripción, intente de nuevo")
                return
            }

            let ruta_img_act = path.join(__dirname, '../data/img_programa/' + hem_selec.id + "-" + hem_selec.descripcion.replace(/\s/g, '_'))

            hem_selec.descripcion = descripcion;

            let ruta_img_nuev = path.join(__dirname, '../data/img_programa/' + hem_selec.id + "-" + descripcion.replace(/\s/g, '_'))

            let data_hembras = JSON.stringify(registros_hembras);

            try {
                fs.renameSync(ruta_img_act, ruta_img_nuev)
            } catch (err) {
                console.log(err, "Error en la parte de carpetas ")
            }

            fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras.json'), data_hembras)

            if (registros_hembras.length % 5 === 0) {
                fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'), data_hembras)
            }
        });
    });

    $("#btn_reg_muer").click(function () {
        document.getElementById("form_reg_muer").style.display = "block";
        document.getElementById('tabla_historia').innerHTML = "";
        document.getElementById("table_more_actions").style.display = "none";

        const form_reg_muer = document.querySelector('#form_reg_muer');
        form_reg_muer.addEventListener('submit', e => {
            const fecha_muerte = document.querySelector('#fecha_muerte').value;

            if (fecha_muerte === "") {
                e.preventDefault()
                alert("Debe registrar la fecha de muerte, intente de nuevo")
                return
            }

            const fecha = (inputFormat = fecha_muerte) => {
                const sep = inputFormat.split("-")
                return [sep[2], sep[1], sep[0]].join('-')
            }

            hem_selec.muerte = fecha();

            let data_hembras = JSON.stringify(registros_hembras);

            fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras.json'), data_hembras)

            if (registros_hembras.length % 5 === 0) {
                fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'), data_hembras)
            }
        });
    });

    $("#btn_reg_ven").click(function () {
        document.getElementById("form_reg_vent").style.display = "block";
        document.getElementById('tabla_historia').innerHTML = "";
        document.getElementById("table_more_actions").style.display = "none";

        const form_reg_vent = document.querySelector('#form_reg_vent');
        form_reg_vent.addEventListener('submit', e => {
            const fecha_venta = document.querySelector('#fecha_venta').value;
            const valor = document.querySelector('#input_valor').value;

            if (fecha_venta === "" || valor === "") {
                e.preventDefault()
                alert("Debe completar todos los campos, intente de nuevo")
                return
            }

            const fecha = (inputFormat = fecha_venta) => {
                const sep = inputFormat.split("-")
                return [sep[2], sep[1], sep[0]].join('-')
            }

            hem_selec.vendido = "Vendido el " + fecha() + " por $" + valor;

            let data_hembras = JSON.stringify(registros_hembras);

            fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras.json'), data_hembras)

            if (registros_hembras.length % 5 === 0) {
                fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'), data_hembras)
            }
        });
    });

    $("#btn_eliminar").click(function () {
        if (confirm("¿Está seguro que quiere eliminar el registro? \n \n Esta acción no se puede revertir")) {
            const index = registros_hembras.indexOf(hem_selec);
            if (index > -1) {
                registros_hembras.splice(index, 1);
            }

            let ruta_img_act = path.join(__dirname, '../data/img_programa/' + hem_selec.id + "-" + hem_selec.descripcion.replace(/\s/g, '_'))

            let ruta_img_nuev = path.join(__dirname, '../data/img_programa/' + "deleted-" + hem_selec.id + "-" + hem_selec.descripcion.replace(/\s/g, '_'))

            try {
                fs.renameSync(ruta_img_act, ruta_img_nuev)
            } catch (err) {
                console.log(err, "Error en la parte de eliminar ")
            }

            let data_hembras = JSON.stringify(registros_hembras);

            fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras.json'), data_hembras)

            if (registros_hembras.length % 5 === 0) {
                fs.writeFileSync(path.join(__dirname, '../data/registros/Hembras-backup.json'), data_hembras)
            }
        }
    });
}

function accionesMacho() {
    $("#btn_edit_desc").click(function () {
        document.getElementById("edit_desc_reg").style.display = "block";
        document.getElementById('tabla_historia').innerHTML = "";
        document.getElementById("table_more_actions").style.display = "none";

        const edit_desc_reg = document.querySelector('#edit_desc_reg');
        edit_desc_reg.addEventListener('submit', e => {
            const descripcion = document.querySelector('#input_edit_desc').value;

            if (descripcion === "") {
                e.preventDefault()
                alert("Debe escribir la nueva descripción, intente de nuevo")
                return
            }

            macho_selec.descripcion = descripcion;
            let data_machos = JSON.stringify(registros);

            fs.writeFileSync(path.join(__dirname, '../data/registros/Machos.json'), data_machos)

            if (registros.length % 5 === 0) {
                fs.writeFileSync(path.join(__dirname, '../data/registros/Machos-backup.json'), data_machos)
            }
        });
    });

    $("#btn_reg_muer").click(function () {
        document.getElementById("form_reg_muer").style.display = "block";
        document.getElementById('tabla_historia').innerHTML = "";
        document.getElementById("table_more_actions").style.display = "none";

        const form_reg_muer = document.querySelector('#form_reg_muer');
        form_reg_muer.addEventListener('submit', e => {
            const fecha_muerte = document.querySelector('#fecha_muerte').value;

            if (fecha_muerte === "") {
                e.preventDefault()
                alert("Debe registrar la fecha de muerte, intente de nuevo")
                return
            }

            const fecha = (inputFormat = fecha_muerte) => {
                const sep = inputFormat.split("-")
                return [sep[2], sep[1], sep[0]].join('-')
            }

            macho_selec.muerte = fecha();

            let data_machos = JSON.stringify(registros);

            fs.writeFileSync(path.join(__dirname, '../data/registros/Machos.json'), data_machos)

            if (registros.length % 5 === 0) {
                fs.writeFileSync(path.join(__dirname, '../data/registros/Machos-backup.json'), data_machos)
            }
        });
    });

    $("#btn_reg_ven").click(function () {
        document.getElementById("form_reg_vent").style.display = "block";
        document.getElementById('tabla_historia').innerHTML = "";
        document.getElementById("table_more_actions").style.display = "none";

        const form_reg_vent = document.querySelector('#form_reg_vent');
        form_reg_vent.addEventListener('submit', e => {
            const fecha_venta = document.querySelector('#fecha_venta').value;
            const valor = document.querySelector('#input_valor').value;

            if (fecha_venta === "" || valor === "") {
                e.preventDefault()
                alert("Debe completar todos los campos, intente de nuevo")
                return
            }

            const fecha = (inputFormat = fecha_venta) => {
                const sep = inputFormat.split("-")
                return [sep[2], sep[1], sep[0]].join('-')
            }

            macho_selec.vendido = "Vendido el " + fecha() + " por $" + valor;

            let data_machos = JSON.stringify(registros);

            fs.writeFileSync(path.join(__dirname, '../data/registros/Machos.json'), data_machos)

            if (registros.length % 5 === 0) {
                fs.writeFileSync(path.join(__dirname, '../data/registros/Machos-backup.json'), data_machos)
            }
        });
    });

    $("#btn_eliminar").click(function () {
        if (confirm("¿Está seguro que quiere eliminar el registro? \n \n Esta acción no se puede revertir")) {
            const index = registros.indexOf(macho_selec);
            if (index > -1) {
                registros.splice(index, 1);
            }

            let data_machos = JSON.stringify(registros);

            fs.writeFileSync(path.join(__dirname, '../data/registros/Machos.json'), data_machos)

            if (registros.length % 5 === 0) {
                fs.writeFileSync(path.join(__dirname, '../data/registros/Machos-backup.json'), data_machos)
            }
        }
    });
}