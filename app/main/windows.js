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

export function setupMainWindow({splashUrl, mainUrl, isDev}) {
  const splashWindow = buildSplashWindow();
  mainWindow = buildSessionWindow();

  splashWindow.loadURL(splashUrl);
  splashWindow.show();

  mainWindow.loadURL(mainUrl);

  let automationName = '';
  let gotAutomationName = false;

  mainWindow.webContents.on('did-finish-load', () => {
    splashWindow.destroy();
    mainWindow.show();
    mainWindow.focus();

    if (isDev) {
      mainWindow.openDevTools();
    }
  });

  ipcMain.on('automation-name', async (_event, value) => {
    console.log(value); // will print value to Node console
    automationName = value;
    gotAutomationName = true;
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const handleCloseCheck = async (check, text) => {
  }
  
  function wait(milleseconds) {
    return new Promise(resolve => setTimeout(resolve, milleseconds));
  }
  
  mainWindow.webContents.on('context-menu', (e, props) => {
    const {x, y} = props;

    gotAutomationName = false;
    mainWindow.webContents.send('get-automation-name', 'open');
    while (!gotAutomationName) {
      wait(200);
    }

    Menu.buildFromTemplate([
      {
        label: i18n.t('Inspect element'),
        click() {
          mainWindow.inspectElement(x, y);
        },
      },
      {
        label: i18n.t('Enter text'),
        click() {
          mainWindow.webContents.send('enter-dialog', 'open');
        },
      },
      {
        label: i18n.t('Test this value'),
        click() {
          mainWindow.webContents.send('check-dialog', 'open');
        },
      },
      {
        label: i18n.t('Check existence'),
        click() {
          mainWindow.webContents.send('check-existence', 'open');
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
  
  rebuildMenus(mainWindow, isDev);
}

export function launchNewSessionWindow() {
  const url = `file://${__dirname}/index.html`;
  const win = buildSessionWindow();
  win.loadURL(url);
  win.show();
}
