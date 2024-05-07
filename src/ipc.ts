import mineflayer from 'mineflayer';
import { IpcLog__ToClient, IpcLog__ToClient__Payload } from './ipc-types'
import { ipcMain } from 'electron';
import { mainWindow } from './main';

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'bot'
});

bot.on('chat', function(username, messageBody) {
  const message = `<${username}> ${messageBody}`

  console.log(message);

  mainWindow.webContents.send(IpcLog__ToClient, {
    type: 'info',
    message
  } as IpcLog__ToClient__Payload);
});

bot.on('error', (err) => {
  console.error(err);

  mainWindow.webContents.send(IpcLog__ToClient, {
    type: 'error',
    message: err.message
  } as IpcLog__ToClient__Payload);
});
