import { Express } from 'express'
import { json } from 'body-parser'
import { dbConnection } from './db/db-connection.service'

import cors from 'cors'
import helmet from 'helmet'
import { helmetOptions } from './utils/security/helmet/helmet-config'

import apiModule from './modules/api/api.module'
import graphqlModule from './modules/graphql/graphql.module'

import { unknownURL } from './utils/handlers/unknown-url.handler copy'
import { globalError } from './utils/handlers/global-error.handler'

export const bootstrap = async (app: Express): Promise<void> => {
  await dbConnection()

  app.use(json())

  app.use(cors({ origin: process.env.ORIGIN }))

  app.use(helmet(helmetOptions))

  app.use('/api/v1', apiModule)

  app.use('/graphql/v1', graphqlModule)

  app.use(/(.*)/, unknownURL)

  app.use(globalError)
}
