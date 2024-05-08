import { Movements, goals } from "mineflayer-pathfinder";
import { bot } from "./index";

import { Entity } from 'prismarine-entity';
import { mainWindow } from "../main";
import { IpcLog__ToClient, IpcLog__ToClient__Payload } from "../ipc-types";

export const attackRecursively = async (entity: Entity) => {
  const interval = setInterval(() => {
    if (!entity || !entity.isValid) {
      clearInterval(interval);

      return;
    }

    bot.lookAt(entity.position.offset(0, entity.height, 0));
    bot.pathfinder.setGoal(new goals.GoalNear(entity.position.x, entity.position.y, entity.position.z, 1));

    if (bot.entity.position.distanceTo(entity.position) > 5) {
      return;
    }

    bot.attack(entity);
  }, 500)
}

export const killSomething = () => {
  const defaultMove = new Movements(bot);
  bot.pathfinder.setMovements(defaultMove);

  const entity = Object.values(bot.entities)
  .filter((entity) => {
    console.log(entity.type)
    return entity.type === 'mob' || entity.type === 'animal' as unknown || entity.type === 'hostile' as unknown;
  })
  .sort((a, b) => {
    return a.position.distanceTo(bot.entity.position) - b.position.distanceTo(bot.entity.position);
  })
  .find((entity) => {
    const goal = new goals.GoalNear(entity.position.x, entity.position.y, entity.position.z, 1);
    const path = bot.pathfinder.getPathTo(defaultMove, goal);
    const isReachable = path.status === 'success';
    
    return isReachable;
  })
  
  if (!entity) {
    console.error('No entities found');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'No entities found'
    } as IpcLog__ToClient__Payload);

    bot.chat('I couldn\'t find anything to kill :(');

    return;
  }

  console.log(`Killing ${entity.displayName}`);

  bot.chat(`I'M GOING TO KILL THAT ${entity.displayName.toUpperCase()}!!`);

  attackRecursively(entity);
}
