import { IpcLog__ToClient, IpcLog__ToClient__Payload } from "../ipc-types";
import { mainWindow } from "../main";

export const handleError = (err: Error) => {
  console.error(err);

  mainWindow.webContents.send(IpcLog__ToClient, {
    type: 'error',
    message: err.message
  } as IpcLog__ToClient__Payload);
}

export const handleLog = (message: string) => {
  console.log(message);

  mainWindow.webContents.send(IpcLog__ToClient, {
    type: 'info',
    message
  } as IpcLog__ToClient__Payload);
}
