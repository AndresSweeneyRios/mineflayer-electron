import { app, BrowserWindow } from 'electron';
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
    pathname: path.join(__dirname, './dist/src/index.html'),
    protocol: 'file:',
    slashes: true
  });

  win.loadURL(indexPath);
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
