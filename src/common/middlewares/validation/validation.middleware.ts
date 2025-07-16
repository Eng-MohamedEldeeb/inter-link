import { ObjectSchema } from 'joi'
import { asyncHandler } from '../../decorators/async-handler/async-handler.decorator'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'

import {
  validateGraphQLInputs,
  validateHttpInputs,
} from './helper/validation-middleware.helpers'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

export const validate = (schema: Record<string, ObjectSchema>) => {
  return asyncHandler(async (...params: HttpParams | GraphQLParams) => {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      return await validateHttpInputs(Ctx, schema)
    }

    if (Ctx.type === ContextType.graphContext) {
      return await validateGraphQLInputs(Ctx, schema)
    }
  })
}
