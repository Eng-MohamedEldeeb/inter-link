import { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import { mainController } from './ws.controller'

export const wsBootStrap = (server: HttpServer) => {
  const io: Server = new Server(server, {
    cors: { origin: process.env.ORIGIN },
  })

  io.on('connection', mainController)
}
