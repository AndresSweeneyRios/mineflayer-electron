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


// log handler
window.electronAPI.on(IpcLog__ToClient, (data: IpcLog__ToClient__Payload) => {
  if (data.type === 'info') {
    console.info(data.message)
  } else if (data.type === 'error'){
    console.error(data.message)
  }
})


// start mining
const mineButtonElement = document.createElement('button')
mineButtonElement.innerText = 'Start Mining 10x10x10 space'
document.body.appendChild(mineButtonElement)

mineButtonElement.onclick = () => {
  window.electronAPI.send(IpcStartMining__ToMain, null)
}

// kill something
const killButtonElement = document.createElement('button')
killButtonElement.innerText = 'Kill something'
document.body.appendChild(killButtonElement)

killButtonElement.onclick = () => {
  window.electronAPI.send(IpcKillSomething__ToMain, null)
}

// build nether portal
const buildNetherPortalButtonElement = document.createElement('button')
buildNetherPortalButtonElement.innerText = 'Build Nether Portal'
document.body.appendChild(buildNetherPortalButtonElement)

buildNetherPortalButtonElement.onclick = () => {
  window.electronAPI.send(IpcBuildNetherPortal__ToMain, null)
}

// cook chicken
const cookChickenButtonElement = document.createElement('button')
cookChickenButtonElement.innerText = 'Cook Chicken'
document.body.appendChild(cookChickenButtonElement)

cookChickenButtonElement.onclick = () => {
  window.electronAPI.send(IpcCookChicken__ToMain, null)
}

// breed cows
const breedCowsButtonElement = document.createElement('button')
breedCowsButtonElement.innerText = 'Breed Cows'
document.body.appendChild(breedCowsButtonElement)

breedCowsButtonElement.onclick = () => {
  window.electronAPI.send(IpcBreedCows__ToMain, null)
}

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
