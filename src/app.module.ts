import { Express } from "express"
import { json } from "body-parser"

import cors from "cors"
import helmet from "helmet"

import { helmetOptions } from "./common/utils/security/helmet/helmet-config"
import { unknownURL } from "./common/handlers/unknown-url.handler"
import { globalError } from "./common/handlers/global-error.handler"
import { CacheService } from "./common/services/cache/cache.service"

import httpModule from "./modules/apis/http.module"
import graphqlModule from "./modules/apis/graphql.module"

export const bootstrap = async (app: Express): Promise<void> => {
  await CacheService.connect()

  app.use(json())

  app.use(cors({ origin: process.env.ORIGIN }))

  app.use(helmet(helmetOptions))

  app.use("/v1/api", httpModule)

  app.use("/v1/graphql", graphqlModule)

  app.use(/(.*)/, unknownURL)

  app.use(globalError)
}
