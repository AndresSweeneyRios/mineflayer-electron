export const IpcLog__ToClient = 'IpcLog__ToClient' as const
export type IpcLog__ToClient__Payload = {
  type: 'info' | 'error'
  message: string
}

export const IpcStartMining__ToMain = 'IpcStartMining__ToMain' as const
export type IpcStartMining__ToMain__Payload = null

export const IpcPlayerList__ToClient = 'IpcPlayerList__ToClient'
export type IpcPlayerList__ToClient__Payload = {
  players: string[]
}

export const IpcTeleportToPlayer__ToMain = 'IpcTeleportToPlayer__ToMain'
export type IpcTeleportToPlayer__Payload__ToMain = {
  username: string
}

export const IpcKillSomething__ToMain = 'IpcKillSomething__ToMain'
export type IpcKillSomething__ToMain__Payload = null

export const IpcBuildNetherPortal__ToMain = 'IpcBuildNetherPortal__ToMain'
export type IpcBuildNetherPortal__ToMain__Payload = null

export const IpcCookChicken__ToMain = 'IpcCookChicken__ToMain'
export type IpcCookChicken__ToMain__Payload = null

export const IpcBreedCows__ToMain = 'IpcBreedCows__ToMain'
export type IpcBreedCows__ToMain__Payload = null