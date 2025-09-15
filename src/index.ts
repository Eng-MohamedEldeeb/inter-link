import { Server as HttpServer } from "node:http"

import express from "express"

import { Server } from "socket.io"
import { portLogger } from "./common/utils/loggers/port-logger"
import { bootstrap } from "./app.module"
import { socketIoBootStrap } from "./modules/socket-io/socket.module"

const app: express.Express = express()
const port: number = Number(process.env.PORT) ?? 3001

const server: HttpServer = app.listen(port, () => portLogger(port))

export const io: Server = new Server(server, {
  cors: { origin: process.env.ORIGIN },
})

bootstrap(app).then(() => {})

socketIoBootStrap(io)
