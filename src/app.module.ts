import { Express } from "express"
import { json } from "body-parser"
import { DataBaseService } from "./db/db.service"
import { cachingDB } from "./common/utils/cache/cache-connection.service"
import { helmetOptions } from "./common/utils/security/helmet/helmet-config"
import { unknownURL } from "./common/handlers/unknown-url.handler"
import { globalError } from "./common/handlers/global-error.handler"

import httpModule from "./modules/apis/http.module"
import graphqlModule from "./modules/apis/graphql.module"
import cors from "cors"
import helmet from "helmet"

export const bootstrap = async (app: Express): Promise<void> => {
  await cachingDB()

  // await DataBaseService.connect()

  app.use(json())

  app.use(cors({ origin: process.env.ORIGIN }))

  app.use(helmet(helmetOptions))

  app.use("/v1/api", httpModule)

  app.use("/v1/graphql", graphqlModule)

  app.use(/(.*)/, unknownURL)

  app.use(globalError)
}
