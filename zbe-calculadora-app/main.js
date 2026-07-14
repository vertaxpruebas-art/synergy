const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('node:path');
const Store = require('electron-store');

const store = new Store({
  name: 'zbe-calculadora-datos',
  defaults: {}
});

Menu.setApplicationMenu(null);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 860,
    minHeight: 600,
    backgroundColor: '#08090c',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, 'app', 'Calculadora_ZBE_Interactiva.html'));
}

ipcMain.handle('zbe-store-get', () => store.get('valores', null));
ipcMain.handle('zbe-store-set', (_event, valores) => {
  store.set('valores', valores);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
