const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow
let nuevoRegistro

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(process.cwd(), '../node_modules', '.bin', 'electron')
    });
}

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, 'assets/img/icon.ico')
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.maximize();

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    })
})

function crearRegistro() {
    nuevoRegistro = new BrowserWindow({
        width: 550,
        height: 550,
        resizable: false,
        title: 'Crear registro',
        icon: path.join(__dirname, 'assets/img/icon.ico')
    });
    // nuevoRegistro.setMenu(null);

    nuevoRegistro.loadURL(url.format({
        pathname: path.join(__dirname, 'views/registro.html'),
        protocol: 'file',
        slashes: true
    }));

    nuevoRegistro.on('closed', () => {
        nuevoRegistro = null;
    });
}

ipcMain.on('registro:nuevo', (e, nuevo_registro) => {
    mainWindow.webContents.send('registro:nuevo', nuevo_registro);
    nuevoRegistro.close();
});

ipcMain.on('hembra:nuevo', (e, nuevo_registro) => {
    mainWindow.webContents.send('hembra:nuevo', nuevo_registro);
    nuevoRegistro.close();
});

const templateMenu = [
    {
        label: 'Inicio',
        click() {
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'views/index.html'),
                protocol: 'file',
                slashes: true
            }));
        }
    },
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Nuevo registro',
                accelerator: "Ctrl+N",
                click() {
                    crearRegistro();
                }
            },
            {
                label: 'Listado consecutivo',
                click() {
                    mainWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'views/listado.html'),
                        protocol: 'file',
                        slashes: true
                    }));
                }
            },
            {
                label: 'Historia individual',
                click() {
                    mainWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'views/historia.html'),
                        protocol: 'file',
                        slashes: true
                    }));
                }
            },
            // {
            //     label: 'Ventas realizadas',
            //     click() {
            //         mainWindow.loadURL(url.format({
            //             pathname: path.join(__dirname, 'views/ventas.html'),
            //             protocol: 'file',
            //             slashes: true
            //         }));
            //     }
            // },
            {
                label: 'Machos registrados',
                click() {
                    mainWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'views/machos.html'),
                        protocol: 'file',
                        slashes: true
                    }));
                }
            },
            {
                label: 'Salir',
                accelerator: "Ctrl+Q",
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'Show/Hide Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}