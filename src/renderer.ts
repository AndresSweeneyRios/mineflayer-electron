import "./global.d.ts"
import './index.css'

import { IpcLog__ToClient, IpcLog__ToClient__Payload } from './ipc-types'

window.electronAPI.on(IpcLog__ToClient, (data: IpcLog__ToClient__Payload) => {
  if (data.type === 'info') {
    console.info(data.message)
  } else if (data.type === 'error'){
    console.error(data.message)
  }
})
