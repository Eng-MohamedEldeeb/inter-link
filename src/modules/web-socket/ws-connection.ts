import { Server, Socket } from 'socket.io'

export const onDisconnection = (socket: Socket) => {
  console.log(`User with id: [${socket.id}] Disconnected from The Server ❌`)
}

export const onConnection = (io: Server) => {
  return (socket: Socket) => {
    console.log(`User with id: [${socket.id}] Connected to The Server ✅`)
    io.on('disconnection', onDisconnection)
  }
}
