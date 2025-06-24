import { Server } from 'node:http'
import express, { Express } from 'express'
import { bootstrap } from './app.module'
import { wsBootStrap } from './web-socket/ws.module'

const app: Express = express()
const port: number = Number(process.env.PORT) ?? 3001

bootstrap(app).then(() => {
  const server: Server = app.listen(port, () =>
    console.log('app is running on port =>', port),
  )

  wsBootStrap(server)
})
