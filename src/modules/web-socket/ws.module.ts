import { Server } from 'node:http'
import { Server as SocketServer } from 'socket.io'
import { onConnection } from './ws-connection'

export const wsBootStrap = (server: Server) => {
  const io: SocketServer = new SocketServer(server, {
    cors: { origin: process.env.ORIGIN },
  })

  io.on('connection', onConnection(io))
}
