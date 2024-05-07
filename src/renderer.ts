import './index.css'

import * as mineflayer from 'mineflayer'

const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'bot'
})

console.log(bot)
