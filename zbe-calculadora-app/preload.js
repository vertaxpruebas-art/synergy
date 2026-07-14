const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('zbeStore', {
  get: () => ipcRenderer.invoke('zbe-store-get'),
  set: (valores) => ipcRenderer.invoke('zbe-store-set', valores)
});
