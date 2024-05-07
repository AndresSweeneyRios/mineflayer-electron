import mineflayer from 'mineflayer';

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'bot'
});

bot.on('chat', function(username, message) {
  console.log(username + ': ' + message);
});
