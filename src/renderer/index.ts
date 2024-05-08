import "./global.d.ts"
import './index.css'

import { 
  IpcBreedCows__ToMain,
  IpcBuildNetherPortal__ToMain,
  IpcCookChicken__ToMain,
  IpcKillSomething__ToMain,
  IpcLog__ToClient, 
  IpcLog__ToClient__Payload,
  IpcPlayerList__ToClient,
  IpcPlayerList__ToClient__Payload,
  IpcStartMining__ToMain,
  IpcTeleportToPlayer__Payload__ToMain,
  IpcTeleportToPlayer__ToMain,
} from '../ipc-types'

const logElement = document.createElement('div')
logElement.id = 'log'
document.body.appendChild(logElement)

// log handler
window.electronAPI.on(IpcLog__ToClient, (data: IpcLog__ToClient__Payload) => {
  if (data.type === 'info') {
    console.info(data.message)

    const logItem = document.createElement('p')
    logItem.innerText = data.message
    logElement.appendChild(logItem)
    logItem.scrollIntoView()
  } else if (data.type === 'error'){
    console.error(data.message)

    const logItem = document.createElement('p')
    logItem.innerText = '[ERROR] ' + data.message
    logItem.style.color = 'red'
    logElement.appendChild(logItem)
    logItem.scrollIntoView()
  }
})

const createButton = (text: string, onClick: () => void) => {
  const buttonElement = document.createElement('button')
  buttonElement.innerText = text
  document.body.appendChild(buttonElement)

  buttonElement.onclick = onClick
}

createButton('Start Mining 10x10x10 space', () => {
  window.electronAPI.send(IpcStartMining__ToMain, null)
})

createButton('Kill something', () => {
  window.electronAPI.send(IpcKillSomething__ToMain, null)
})

createButton('Build Nether Portal', () => {
  window.electronAPI.send(IpcBuildNetherPortal__ToMain, null)
})

createButton('Cook Chicken', () => {
  window.electronAPI.send(IpcCookChicken__ToMain, null)
})

createButton('Breed Cows', () => {
  window.electronAPI.send(IpcBreedCows__ToMain, null)
})

// teleport
const teleport = (username: string) => {
  const payload: IpcTeleportToPlayer__Payload__ToMain = { username }

  window.electronAPI.send(IpcTeleportToPlayer__ToMain, payload)
}

// player list
const playerList: string[] = []

const playerListElement = document.createElement('div')
playerListElement.id = 'player-list'
document.body.appendChild(playerListElement)

const fillPlayerListElement = () => {
  while (playerListElement.firstChild) {
    playerListElement.removeChild(playerListElement.firstChild)
  }

  playerList.forEach(player => {
    const playerElement = document.createElement('p')
    playerElement.innerText = player
    playerListElement.appendChild(playerElement)

    const teleportButtonElement = document.createElement('button')
    teleportButtonElement.innerText = 'Teleport'
    
    teleportButtonElement.onclick = () => {
      teleport(player)
    }

    playerElement.appendChild(teleportButtonElement)
  })
}

window.electronAPI.on(IpcPlayerList__ToClient, (data: IpcPlayerList__ToClient__Payload) => {
  playerList.length = 0
  playerList.push(...data.players)

  fillPlayerListElement()
})
