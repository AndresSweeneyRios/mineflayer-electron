import { bot } from "./index";

import { mainWindow } from '../main';
import { Vec3 } from 'vec3';
import { IpcLog__ToClient, IpcLog__ToClient__Payload } from "../ipc-types";

export const buildPortal = async () => {
  const position = new Vec3(bot.entity.position.x, bot.entity.position.y, bot.entity.position.z);

  let location = [0, 0, 0]

  // full 2x3 portal with 4x5 frame
  const portal = [
    // bottom
    [0, 0, 0],
    [1, 0, 0],
    [2, 0, 0],
    [3, 0, 0],

    // middle section
    [0, 1, 0],
    [3, 1, 0],

    [0, 2, 0],
    [3, 2, 0],

    [0, 3, 0],
    [3, 3, 0],

    // top
    [0, 4, 0],
    [1, 4, 0],
    [2, 4, 0],
    [3, 4, 0],
  ]

  // find a suitable location
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
    const firstLayer = portal.slice(0, 4)

    let isTouchingGround = false
    
    for (const [dx, dy, dz] of firstLayer) {
      const referenceBlock = blockMap.get(`${block.x + dx},${block.y + dy - 1},${block.z + dz}`);

      if (!referenceBlock) {
        isTouchingGround = true;

        break;
      }
    }

    if (!isTouchingGround) {
      continue;
    }

    foundSuitableLocation = true;

    for (const [dx, dy, dz] of portal) {
      const referenceBlock = blockMap.get(`${block.x + dx},${block.y + dy},${block.z + dz}`);

      // exclude start position
      // sum difference and check threshold
      const tooClose = Math.abs(block.x - position.x) + Math.abs(block.y - position.y) + Math.abs(block.z - position.z) < 5;

      if (!referenceBlock || tooClose) {
        foundSuitableLocation = false;

        break;
      }
    }

    if (foundSuitableLocation) {
      location = [Math.floor(block.x), Math.floor(block.y), Math.floor(block.z)];

      break;
    }
  }

  if (!foundSuitableLocation) {
    console.error('No suitable location found');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'No suitable location found'
    } as IpcLog__ToClient__Payload);

    bot.chat('I couldn\'t find a suitable location to build a nether portal');

    return;
  }

  bot.chat('Nether portal? I was feeling a bit cold anyway.')

  for (const [x, y, z] of portal) {
    // Using cheats because the placement logic is very complex.
    //
    // It uses a reference block scheme, which makes sense,
    // but would require a lot of math.

    const position = new Vec3(location[0] + x, location[1] + y, location[2] + z);

    bot.chat(`/setblock ${position.x} ${position.y} ${position.z} obsidian`);

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // path to middle of portal and look at bottom middle block
  const middle = portal[1];

  // we want to be right next to it, 1 block away on the z-axis
  const lightBlockPosition = new Vec3(location[0] + middle[0], location[1] + middle[1], location[2] + middle[2]);

  bot.creative.startFlying();

  // teleport to y+2 z-1
  bot.chat(`/tp ${lightBlockPosition.x + 1} ${lightBlockPosition.y + 1} ${lightBlockPosition.z - 1}`);

  await new Promise((resolve) => setTimeout(resolve, 500));

  const lightBlock = bot.blockAt(lightBlockPosition);

  if (!bot.canSeeBlock(lightBlock)) {
    console.error('Can\'t see light block');

    mainWindow.webContents.send(IpcLog__ToClient, {
      type: 'error',
      message: 'Can\'t see light block'
    } as IpcLog__ToClient__Payload);

    bot.chat('I can\'t see the light block');

    return;
  }

  // look at top of the block
  await bot.lookAt(lightBlock.position, true);

  // find or cheat in obsidian, flint and steel

  let flintAndSteel = bot.inventory.items().find((item) => item.name === 'flint_and_steel');

  if (!flintAndSteel) {
    // grant item
    bot.chat('/give @s flint_and_steel');

    await new Promise((resolve) => setTimeout(resolve, 500));

    flintAndSteel = bot.inventory.items().find((item) => item.name === 'flint_and_steel');
  }

  // light the portal with actual flint and steel
  await bot.equip(flintAndSteel, 'hand');

  // activate flint and steel
  await bot.activateBlock(lightBlock);

  // clear inventory
  bot.chat('/clear');

  bot.creative.stopFlying();

  bot.chat('All warmed up. Time for a hot lava bath.');
}
