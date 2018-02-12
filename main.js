'use strict';

const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;
const url = require('url');
const path = require('path');
const exec = require('child_process').execFile;
const express = require('express');
const bodyParser = require('body-parser');
const isDev = require('electron-is-dev');

let mainWindow;
global.token = null;
global.actualProperty = null;
global.actualCommunity = null;
global.communities = [];
global.properties = [];

global.url_reference = "https://www.comunidadfeliz.cl";

let server = function() {
  const sv = express();
  sv.use(bodyParser.json());

  sv.post('/', function(req, res) {
    console.log(req.body);
    if(global.token !== null && global.actualCommunity !== null && global.actualProperty !== null) {
      mainWindow.webContents.send('3MInput', req.body);
    }
    res.status('200');
    res.end();
  });

  const port = 8000;
  sv.listen(port);
  console.log("Listening at http://localhost:" + port);
}

let reader = function(){
  console.log("reader start");
  exec('assets/3M/Release/SwipeReaderMessages.exe', function(err, data) {  
    console.log(err)
    console.log(data.toString());                       
  });  
}

app.on('ready', function(){
  mainWindow = new BrowserWindow({
    minWidth: 1400,
    minHeight: 800,
    show: false
  });
  mainWindow.maximize();
  mainWindow.show();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file',
    slashes: true
  }));

  if(process.platform === 'win32') {
    server();
    reader();
  };

  mainWindow.on('closed', function(){
    app.quit();
  });
  
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
  {
    label: 'Archivo',
    submenu: [
      {label: 'Minimizar', role: 'minimize'},
      {
        label: 'Salir',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Sesión',
    submenu: [
      {
        label: 'Cerrar sesión',
        click(){
          end_session();
        }
      }
    ]
  },
  {
    label: 'Vista',
    submenu: [
      {label: "Recargar", role: 'reload'},
      {type: 'separator'},
      {label: 'Resetear zoom', role: 'resetzoom'},
      {label: 'Agregar zoom', role: 'zoomin'},
      {label: 'Reducir zoom', role: 'zoomout'},
      {type: 'separator'},
      {label: 'Pantalla completa', role: 'togglefullscreen'},
      {accelerator: 'Ctrl+I', role: 'toggledevtools'}
    ]
  }
];

const end_session = function() {
  global.token = null;
  global.actualPage = "";
  global.actualCommunity = null;
  global.communities = [];
  global.properties = [];
  global.actualPageID = null;
  mainWindow.reload();
}

ipcMain.on('setToken', function(e, t){
  global.token = t;
});

ipcMain.on('setProperty', function(e, p){
  global.actualProperty = p;
});

ipcMain.on('setActualCommunity', function(e, ac){
  global.actualCommunity = ac;
});

ipcMain.on('resetCommunities', function(e){
  global.communities = [];
});

ipcMain.on('setCommunities', function(e, c){
  global.communities.push(c);
});

ipcMain.on('resetProperties', function(e){
  global.properties = [];
});

ipcMain.on('setProperties', function(e, p){
  global.properties.push(p);
});