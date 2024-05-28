import {clipboard, ipcRenderer, remote, shell} from 'electron';
import log from 'electron-log';
import settings from 'electron-settings';
import fs from 'fs';
import i18NextBackend from 'i18next-fs-backend';
import path from 'path';
import util from 'util';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

const i18NextBackendOptions = {
  loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
  addPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
  jsonIndent: 2,
};

export {
  log,
  clipboard,
  shell,
  remote,
  ipcRenderer,
  settings,
  i18NextBackend,
  i18NextBackendOptions,
  fs,
  util,
};
