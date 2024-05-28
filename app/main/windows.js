import {BrowserWindow, Menu, dialog, ipcMain, webContents} from 'electron';
//const dialogs = require('electron-dialogs').renderer('dialogs-test');

import i18n from '../configs/i18next.config';
import {openFilePath} from '../main';
import settings from '../shared/settings';
import {APPIUM_SESSION_EXTENSION} from './helpers';
import {rebuildMenus} from './menus';
import path from 'path';

let mainWindow = null;

function buildSplashWindow() {
  return new BrowserWindow({
    width: 300,
    height: 300,
    minWidth: 300,
    minHeight: 300,
    frame: false,
  });
}

function buildSessionWindow() {
  const window = new BrowserWindow({
    show: false,
    width: 1100,
    height: 710,
    minWidth: 890,
    minHeight: 710,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      additionalArguments: openFilePath ? [`filename=${openFilePath}`] : [],
    },
  });

  ipcMain.on('save-file-as', async () => {
    const {canceled, filePath} = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Appium File',
      filters: [{name: 'Appium Session Files', extensions: [APPIUM_SESSION_EXTENSION]}],
    });
    if (!canceled) {
      mainWindow.webContents.send('save-file', filePath);
    }
  });

  return window;
}

/*
function prepareOpenDialog() {
  ipcMain.on('openEnterDIalog', (_event, options) => {
    const win = new BrowserWindow({
      'width': 360,
      'height': 120, 
      'parent': mainWindow,
      'show': true,
      'modal': true,
      'alwaysOnTop' : true, 
      'title' : options.title,
      'autoHideMenuBar': true,
      'webPreferences' : { 
        "nodeIntegration":true,
        "sandbox" : false 
      }   
    });

    win.on('closed', () => { 
      win = null;
    })
  
    // Load the HTML dialog box
    console.log(path.join(__dirname, "enter_text.html"));
    win.loadURL(path.join(__dirname, "enter_text.html"))
    //win.once('ready-to-show', () => { win.show() })

    ipcMain.on("openDialog", (event, data) => {
      event.returnValue = JSON.stringify(options, null, '')
    });
  
    // Called by the dialog box when closed
    ipcMain.on("closeDialog", (event, data) => {
      const {DATA_TYPE} = DEFAULT_TEXT;
      const {DURATION_1} = DEFAULT_TAP;
      const commandRes = applyClientMethod({
        methodName: TEXT,
        args: [
          {
            [DATA_TYPE]: [
              {type: POINTER_MOVE, duration: DURATION_1, x: x, y: y},
              {type: ENTER_TEXT, text: data},
            ],
          },
        ],
      });
    });
  });
  ipcMain.on('openCheckDIalog', (_event, options) => {
    let win = new BrowserWindow({
      width: 400,
      height: 200,
      show: true,
      modal: true,
      webPreferences: {
        nodeIntegration: true, // Needed for IPC communication
      },
    });
  
    win.loadFile(path.join(__dirname, 'label_check.html'));
    //win.once('ready-to-show', () => { win.show() })
  
    win.on('closed', () => {
      win = null;
    });
  
    win.on('ipc-message', (event, arg) => {
      // Handle data received from the dialog (checkbox state, text input value)
      console.log('Received data from dialog:', arg);
      if (arg.checked) {
        const {DATA_TYPE} = DEFAULT_TEXT;
        const {DURATION_1} = DEFAULT_TAP;
        const commandRes = applyClientMethod({
          methodName: TEXT,
          args: [
            {
              [DATA_TYPE]: [
                {type: POINTER_MOVE, duration: DURATION_1, x: x, y: y},
                {type: CHECK_TEXT, text: arg.text},
              ],
            },
          ],
        });
        //return commandRes;
      }
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  });
}
*/

export function setupMainWindow({splashUrl, mainUrl, isDev}) {
  const splashWindow = buildSplashWindow();
  mainWindow = buildSessionWindow();

  splashWindow.loadURL(splashUrl);
  splashWindow.show();

  mainWindow.loadURL(mainUrl);

  mainWindow.webContents.on('did-finish-load', () => {
    splashWindow.destroy();
    mainWindow.show();
    mainWindow.focus();

    if (isDev) {
      mainWindow.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('context-menu', (e, props) => {
    const {x, y} = props;

    Menu.buildFromTemplate([
      {
        label: i18n.t('Inspect element'),
        click() {
          mainWindow.inspectElement(x, y);
        },
      },
    ]).popup(mainWindow);
  });

  i18n.on('languageChanged', async (languageCode) => {
    rebuildMenus(mainWindow, isDev);
    await settings.set('PREFERRED_LANGUAGE', languageCode);
    webContents.getAllWebContents().forEach((wc) => {
      wc.send('appium-language-changed', {
        language: languageCode,
      });
    });
  });

  //prepareOpenDialog();

  rebuildMenus(mainWindow, isDev);
}

export function launchNewSessionWindow() {
  const url = `file://${__dirname}/index.html`;
  const win = buildSessionWindow();
  win.loadURL(url);
  win.show();
}
