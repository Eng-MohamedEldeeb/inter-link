import { ArraySchema, ObjectSchema } from 'joi'
import { asyncHandler } from '../decorators/async-handler.decorator'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { ContextType } from '../decorators/types/async-handler.types'
import { throwHttpError } from '../handlers/http/error-message.handler'
import { IRequest } from '../interface/http/IRequest.interface'

export const validate = <PA = any, QC = any>(
  schema: Record<string, ObjectSchema | ArraySchema>,
) => {
  return asyncHandler(async (...params: any[any]) => {
    const contextType = ContextDetector.detect(params)

    if (contextType === ContextType.graphContext) {
      for (const key of Object.keys(schema)) {
        const { error } = schema[key].validate(
          params[key as keyof { args: PA; context: QC }],
          {
            abortEarly: false,
            allowUnknown: false,
          },
        )

        if (error) {
          throw new Error(error.message, { cause: error.details })
        }
      }
    }

    if (contextType === ContextType.httpContext) {
      const errors = []
      const { req, next } = ContextDetector.switchToHTTP(params)

      for (const key of Object.keys(schema)) {
        const { error } = schema[key].validate(req[key as keyof IRequest], {
          abortEarly: false,
          allowUnknown: false,
        })

        if (error) {
          errors.push({
            key,
            detail: error.details.map(e => ({
              message: e.message,
              path: e.path,
              type: e.type,
            })),
          })
        }
      }

      if (errors.length)
        return throwHttpError({
          msg: 'validation error',
          details: errors,
          status: 400,
        })

      return next()
    }
  })
}
