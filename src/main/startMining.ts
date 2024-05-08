import { bot } from "./index";

import { Movements, goals } from 'mineflayer-pathfinder';
import { Vec3 } from 'vec3';

export const startMining = async () => {
  console.log('Starting mining');

  const movements = new Movements(bot);
  bot.pathfinder.setMovements(movements);

  const position = new Vec3(bot.entity.position.x, bot.entity.position.y, bot.entity.position.z);

  bot.chat('Oh boy, time for unpaid labor!');

  // Mine every block in a 10x10x10 cube centered on the bot, from top to bottom
  for (let y = position.y + 5; y > position.y - 5; y--) {
    for (let x = position.x - 5; x < position.x + 5; x++) {
      for (let z = position.z - 5; z < position.z + 5; z++) {
        {
          const block = bot.blockAt(new Vec3(x, y, z));
  
          if (!block || block.name === 'air') {
            console.log('Skipping air')

            continue
          }
        }

        bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z), true);

        console.log('Moving into position')

        await new Promise((resolve) => setTimeout(resolve, 500));

        while (bot.pathfinder.isMoving()) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        if (bot.entity.position.distanceTo(new Vec3(x, y, z)) > 0.1) {
          console.log("Couldn't reach position, moving on")

          continue;
        }
        
        const block = bot.blockAt(new Vec3(x, y, z));

        bot.dig(block, true);
      }
    }
  }
}
