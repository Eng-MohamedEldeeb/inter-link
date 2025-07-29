import { Server as HttpServer } from 'node:http'

import express from 'express'

import chalk from 'chalk'

import { bootstrap } from './app.module'
import { Server } from 'socket.io'
import { socketIoBootStrap } from './modules/socketIo.module'

const app: express.Express = express()
const port: number = Number(process.env.PORT) ?? 3001

bootstrap(app)

const server: HttpServer = app.listen(port, () =>
  console.log(chalk.blue('app is running on port =>', chalk.yellow(port))),
)

export const io: Server = new Server(server, {
  cors: { origin: process.env.ORIGIN },
})

socketIoBootStrap(io)
