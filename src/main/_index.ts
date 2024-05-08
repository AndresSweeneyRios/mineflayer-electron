import mineflayer from 'mineflayer';
import { ipcMain } from 'electron';
import { mainWindow } from '../main';
import { pathfinder } from 'mineflayer-pathfinder';

import { 
  IpcBreedCows__ToMain,
  IpcBuildNetherPortal__ToMain,
  IpcCookChicken__ToMain,
  IpcKillSomething__ToMain,
  IpcPlayerList__ToClient, 
  IpcPlayerList__ToClient__Payload, 
  IpcStartMining__ToMain, 
  IpcTeleportToPlayer__Payload__ToMain, 
  IpcTeleportToPlayer__ToMain
} from '../ipc-types'

import { startMining } from './startMining';
import { teleport } from './teleport';
import { killSomething } from './killSomething';
import { buildPortal } from './buildPortal';
import { cookChicken } from './cookChicken';
import { breedCows } from './breedCows';
import { handleError, handleLog } from './logHelpers';

// Vite keeps trying to optimize the minecraft-data library, 
// which leads to a memory error (apprently using more than 8gb), 
// so all the names are hardcoded for now instead.

export const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'bot'
});

bot.loadPlugin(pathfinder);

// set gamemode to creative
bot.on('login', () => {
  bot.chat('/gamemode creative');
})

// Info
bot.on('chat', function(username, messageBody) {
  const message = `<${username}> ${messageBody}`

  handleLog(message);

  if (username === bot.username) return;

  bot.chat(messageBody.split('').reverse().join(' ').toUpperCase());
});

bot.on('error', handleError);

bot.on('end', () => {
  handleLog('Bot disconnected');
})

bot.once('spawn', () => {
  handleLog('Bot spawned');
})

// Send player list to client, excluding the bot
setInterval(() => {
  const payload: IpcPlayerList__ToClient__Payload = {
    players: Object.keys(bot.players).filter((player) => player !== bot.username)
  }

  mainWindow.webContents.send(IpcPlayerList__ToClient, payload);
}, 500);

// Mine 10x10x10 space
ipcMain.on(IpcStartMining__ToMain, () => {
  startMining().catch(handleError);
})

// Teleport to player
ipcMain.on(IpcTeleportToPlayer__ToMain, (event, payloadToMain: IpcTeleportToPlayer__Payload__ToMain) => {
  teleport(payloadToMain.username)
})

// Kill something
ipcMain.on(IpcKillSomething__ToMain, killSomething)

// Build nether portal
ipcMain.on(IpcBuildNetherPortal__ToMain, () => {
  buildPortal().catch(handleError);
})

// Place furnace, kill chicken, and then cook it
ipcMain.on(IpcCookChicken__ToMain, () => {
  cookChicken().catch(handleError)
})

// Breed cows
ipcMain.on(IpcBreedCows__ToMain, () => {
  breedCows().catch(handleError)
})
