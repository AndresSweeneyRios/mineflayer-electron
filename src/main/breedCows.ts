import { bot } from "./_index";

import { mainWindow } from '../main';
import { IpcLog__ToClient, IpcLog__ToClient__Payload } from "../ipc-types";

export const breedCows = async () => {
  // cheat spawn 2 cows
  bot.chat('/summon minecraft:cow');
  bot.chat('/summon minecraft:cow');

  // cheat in wheat x2
  bot.chat('/give @s wheat 2');
  
  await new Promise((resolve) => setTimeout(resolve, 500));

  const wheatItem = bot.inventory.items().find((item) => item.name === 'wheat');

  if (!wheatItem || wheatItem.count < 2) {
    console.error('Not enough wheat');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'Not enough wheat'
    } as IpcLog__ToClient__Payload);

    bot.chat('I couldn\'t find enough wheat to breed the cows');

    return;
  }

  await bot.equip(wheatItem, 'hand');

  // find cows
  const cowEntities = Object.values(bot.entities).filter((entity) => {
    return entity.type === 'animal' as unknown;
  }).sort((a, b) => {
    return a.position.distanceTo(bot.entity.position) - b.position.distanceTo(bot.entity.position);
  })

  if (cowEntities.length < 2) {
    console.error('Not enough cows');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'Not enough cows'
    } as IpcLog__ToClient__Payload);

    bot.chat('I couldn\'t find enough cows to breed');

    return;
  }

  // breed cows
  const cow1 = cowEntities[0];
  const cow2 = cowEntities[1];

  bot.chat('Time to play matchmaker');

  await bot.activateEntity(cow1);
  await bot.activateEntity(cow2);
}
