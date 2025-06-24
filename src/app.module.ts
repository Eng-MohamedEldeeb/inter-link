import { Express } from 'express'
import { json } from 'body-parser'
import { dbConnection } from './db/db-connection.service'

import cors from 'cors'
import helmet from 'helmet'
import { helmetOptions } from './common/utils/security/helmet/helmet-config'

import httpModule from './http/http.module'
import graphqlModule from './graphql/graphql.module'

import { unknownURL } from './common/utils/handlers/unknown-url.handler'
import { globalError } from './common/utils/handlers/global-error.handler'

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
