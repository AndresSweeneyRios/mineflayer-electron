interface Ipc {
  type: string
  payload: unknown
}

export const IpcLog__ToClient = 'log' as const

export interface IpcLog__ToClient__Payload extends Ipc {
  type: 'info' | 'error'
  message: string
}
