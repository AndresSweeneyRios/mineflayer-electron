import { bot } from "./index";

export const teleport = (username: string) => {
  console.log(`Teleporting to ${username}`)

  bot.chat(`/tp ${username}`);

  bot.chat(`hiii ${username}`);
}
