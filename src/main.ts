import { Server } from 'node:http'
import express from 'express'
import chalk from 'chalk'
import { bootstrap } from './app.module'
import { wsBootStrap } from './web-socket/ws.module'

const app: express.Express = express()
const port: number = Number(process.env.PORT) ?? 3001

bootstrap(app).then(() => {
  const server: Server = app.listen(port, () =>
    console.log(chalk.blue('app is running on port =>', chalk.yellow(port))),
  )

  wsBootStrap(server)
})
