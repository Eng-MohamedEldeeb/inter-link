import { Socket } from 'socket.io'

export const mainController = (socket: Socket) => {
  console.log(`User with id: [${socket.id}] Connected to The Server ✅`)
  socket.on('disconnection', () => {
    console.log(`User with id: [${socket.id}] Disconnected from The Server ❌`)
  })
}
