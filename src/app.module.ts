import { Express } from 'express'
import { json } from 'body-parser'
import { dbConnection } from './db/db-connection.service'
import { helmetOptions } from './common/utils/security/helmet/helmet-config'
import { unknownURL } from './common/handlers/unknown-url.handler'
import { globalError } from './common/handlers/global-error.handler'

import httpModule from './modules/http.module'
import graphqlModule from './modules/graphql.module'
import cors from 'cors'
import helmet from 'helmet'

export const bootstrap = async (app: Express): Promise<void> => {
  await dbConnection()

  app.use(json())

  app.use(cors({ origin: process.env.ORIGIN }))

  app.use(helmet(helmetOptions))

  app.use('/api/v1', httpModule)

  app.use('/graphql/v1', graphqlModule)

  app.use(/(.*)/, unknownURL)

  app.use(globalError)
}
