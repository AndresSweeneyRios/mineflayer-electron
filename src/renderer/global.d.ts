declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data: unknown) => void
      on: (channel: string, func: (...args: unknown[]) => void) => void
    }
  }
}
