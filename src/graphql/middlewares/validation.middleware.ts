import { ArraySchema, ObjectSchema } from 'joi'
import { throwHttpError } from '../../common/utils/handlers/error-message.handler'

export const validate = <A = any, C = any>(
  schema: Record<string, ObjectSchema | ArraySchema>,
) => {
  return async (data: { args: A; context: C }) => {
    for (const key of Object.keys(schema)) {
      const { error } = schema[key].validate(
        data[key as keyof { args: A; context: C }],
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
}
