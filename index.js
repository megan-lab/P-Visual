const electron = require("electron");
const uuid = require("uuid");
const {app, BrowserWindow, Menu, ipcMain} = electron;

let todayWindow;
let createWindow;
let listWindow;

let allAppointment = [];

app.on("ready", () => {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true 
        },
        title: "Aplikasi Sewa Kebaya"
    });
    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () => {

        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration : true
        },
        width : 600,
        height : 400,
        title: "All Apponitment"
    });
    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed",() => (listWindow = null));
};

const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration : true
        },
        width : 600,
        height : 400,
        title: "Create Appointment"
    });
    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("closed",() => (createWindow = null));
};

const aboutWindowCreator = () => {
    aboutWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration : true
        },
        width : 600,
        height : 400,
        title: "About Pages"
    });
    aboutWindow.setMenu(null);
    aboutWindow.loadURL(`file://${__dirname}/about.html`);
    aboutWindow.on("closed",() => (aboutWindow = null));
};


ipcMain.on("appointment:create", (event, appointment) => {
    appointment["id"] = uuid();
    appointment["done"] = 0;
    allAppointment.push(appointment);

    createWindow.close();

    console.log(appointment);
});

ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allAppointment);
});

ipcMain.on("appointment:request:today", event => {
    console.log("here1"); 
});

ipcMain.on("appointment:done", (event, id )=> {
    console.log("here2");
});


const menuTemplate = [{
    label: "File",
    submenu: [{
                label : "Create Appointment",
               
                click(){
                    createWindowCreator();
                }
            },
            {
                label : "List Appointment",
               
                click(){
                    listWindowCreator();
                }
            },

            {
                label: 'Quit',
                accelerator : process.platform === "darwin" ? "Command + Q" : " Ctrl + Q",
                click(){
                    app.quit();
                }
            }
        
    ]
},
{
    label: "View",
    submenu: [{ role:"realod"},{role:"toogledevtools"}]
},
{
    label: "About",
        click(){
            aboutWindowCreator();
        }
}


]
