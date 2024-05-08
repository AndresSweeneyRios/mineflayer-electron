import { bot } from "./index";

import { mainWindow } from '../main';
import { Vec3 } from 'vec3';
import { IpcLog__ToClient, IpcLog__ToClient__Payload } from "../ipc-types";
import { attackRecursively } from "./killSomething";
import { goals } from "mineflayer-pathfinder";

export const cookChicken = async () => {
  bot.chat('Time for some chicken!!');

  // First, let's cheat in a furnace
  bot.chat('/give @s furnace');

  await new Promise((resolve) => setTimeout(resolve, 500));

  const furnaceItem = bot.inventory.items().find((item) => item.name === 'furnace');

  if (!furnaceItem) {
    console.error('Furnace not found');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'Furnace not found'
    } as IpcLog__ToClient__Payload);

    return;
  }

  // Place the furnace
  bot.equip(furnaceItem, 'hand');

  // Now we need to find a suitable location to place the furnace
  const position = new Vec3(bot.entity.position.x, bot.entity.position.y, bot.entity.position.z);

  let location = [0, 0, 0]

  // get a list of blocks in a 30x30x30 cube centered on the bot
  const blocks = bot.findBlocks({
    matching: (block) => {
      return block.name === 'air' || block.name === 'short_grass' || block.name === 'tall_grass'
    },
    maxDistance: 30,
    count: 1000,
    point: position
  });

  // turn blocks into a map
  // this should use a more efficient hashing algorithm, but that's okay
  const blockMap = new Map<string, boolean>();

  for (const block of blocks) {
    blockMap.set(`${block.x},${block.y},${block.z}`, true);
  }

  let foundSuitableLocation = false;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // we want to determine if at least one block is touching the ground
    const referenceBlock = blockMap.get(`${block.x},${block.y - 1},${block.z}`);

    // check distance to player
    const tooClose = Math.abs(block.x - position.x) + Math.abs(block.y - position.y) + Math.abs(block.z - position.z) < 5;

    if (!referenceBlock || tooClose) {
      continue;
    }

    foundSuitableLocation = true;

    location = [block.x, block.y, block.z];

    break;
  }

  if (!foundSuitableLocation) {
    console.error('No suitable location found');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'No suitable location found'
    } as IpcLog__ToClient__Payload);

    bot.chat('I couldn\'t find a suitable location to place the furnace');

    return;
  }

  console.log(`Placing furnace at ${location}`);

  // Place furnace from hand
  const furnaceBlockSurface = bot.blockAt(new Vec3(location[0], location[1] - 1, location[2]));

  bot.placeBlock(furnaceBlockSurface, new Vec3(0, 1, 0)).catch(() => {
    // This promise is broken, so we can ignore this error
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  bot.chat('/clear')

  // find furnace block

  // Now we need to find a chicken to cook
  // spawn chicken with cheats
  console.log('Spawning chicken');

  bot.chat('/summon minecraft:chicken');

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // find chicken
  const chickenEntities = Object.values(bot.entities).filter((entity) => {
    // Entity display name is unreliable, frequently returns undefined
    // so we just have to use the closest one here

    // The types are out of date, so we have to use a type assertion
    return entity.type === 'mob' || entity.type === 'animal' as unknown;
  }).sort((a, b) => {
    return a.position.distanceTo(bot.entity.position) - b.position.distanceTo(bot.entity.position);
  })

  if (chickenEntities.length === 0) {
    console.error('No chickens found');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'No chickens found'
    } as IpcLog__ToClient__Payload);

    bot.chat('I couldn\'t find any chickens to kill');

    return;
  }

  // kill chicken
  console.log('Killing chicken');
  
  bot.chat('Out on the hunt...')

  const chickenEntity = chickenEntities[0]
  attackRecursively(chickenEntity);

  let lastKnownPosition: Vec3 = chickenEntity.position;

  while (chickenEntities[0].isValid) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    lastKnownPosition = chickenEntity.position;
  }

  // collect chicken
  // path to last known position
  console.log('Collecting chicken');

  bot.pathfinder.setGoal(new goals.GoalNear(lastKnownPosition.x, lastKnownPosition.y, lastKnownPosition.z, 1));
  
  while (bot.pathfinder.isMoving()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const chickenItem = bot.inventory.items().find((item) => item.name === 'chicken');

  if (!chickenItem) {
    console.error('Chicken not found');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'Chicken not found'
    } as IpcLog__ToClient__Payload);

    bot.chat('I couldn\'t find the raw chicken');

    return;
  }

  // path to furnace
  console.log('Moving to furnace');

  bot.pathfinder.setGoal(new goals.GoalNear(location[0], location[1], location[2], 1));
  
  while (bot.pathfinder.isMoving()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const furnaceBlock = bot.findBlock({
    matching: (block) => {
      return block.name === 'furnace';
    },

    maxDistance: 12
  });

  bot.pathfinder.setGoal(new goals.GoalNear(furnaceBlock.position.x, furnaceBlock.position.y, furnaceBlock.position.z, 1));

  while (bot.pathfinder.isMoving()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // cheat in coal
  console.log('Cheating in coal');

  bot.chat('/give @s coal');

  await new Promise((resolve) => setTimeout(resolve, 500));

  const coalItem = bot.inventory.items().find((item) => item.name === 'coal');

  if (!coalItem) { 
    console.error('Coal not found');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'Coal not found'
    } as IpcLog__ToClient__Payload);

    bot.chat('I couldn\'t find any coal to cook the chicken');

    return;
  }

  // place chicken in furnace
  console.log('Placing chicken in furnace');

  const furnace = await bot.openFurnace(furnaceBlock);

  console.log('Adding fuel');

  await furnace.putFuel(coalItem.type, coalItem.metadata, 1);

  console.log('Adding chicken');

  await furnace.putInput(chickenItem.type, chickenItem.metadata, 1);

  // wait for chicken to cook
  while (!furnace.slots[2]) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // collect cooked chicken
  console.log('Removing cooked chicken');

  await furnace.takeOutput();

  // eat chicken
  console.log('Eating chicken');

  await new Promise((resolve) => setTimeout(resolve, 500));

  // I really tried to get this section to work,
  // but the cooked chicken consistently disappears into the void.

  /*
    const cookedChickenItem = bot.inventory.items().find((item) => item.name === 'cooked_chicken');

    await bot.equip(cookedChickenItem, 'hand');

    await new Promise((resolve) => setTimeout(resolve, 500));

    bot.activateItem();
  */

  bot.chat('Mmm, delicious chicken');

  // clear inventory

  bot.chat('/clear');
}
