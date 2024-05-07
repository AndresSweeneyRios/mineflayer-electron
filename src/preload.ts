// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, data: unknown) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
})

declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data: unknown) => void
      on: (channel: string, func: (...args: unknown[]) => void) => void
    }
  }
}
