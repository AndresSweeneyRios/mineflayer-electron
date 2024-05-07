import { app, BrowserWindow, globalShortcut } from 'electron';
import * as path from 'path';
import * as url from 'url';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Set to false only if you need node integration in renderer
    }
  });

  // and load the index.html of the app.
  const indexPath = url.format({
    pathname: path.join(__dirname, './src/index.html'),
    protocol: 'file:',
    slashes: true
  });

  win.loadURL(indexPath);
  win.setMenu(null)
  
  // Register a global shortcut listener for DevTools
  const ret = globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (win) {
      win.webContents.toggleDevTools();
    }
  });

  if (!ret) {
    console.log('Registration failed');
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
