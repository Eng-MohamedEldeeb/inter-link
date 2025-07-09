import { CustomHelpers, CustomValidator, ErrorReport } from 'joi'
import { Types } from 'mongoose'

export const isValidMongoId: CustomValidator = (
  v: string,
  helpers: CustomHelpers,
): true | ErrorReport => {
  return Types.ObjectId.isValid(v)
    ? true
    : helpers.error('string.base', { key: 'id' }, { path: ['id'] })
}

export const optionalMongoId: CustomValidator = (
  v: string,
  helpers: CustomHelpers,
) => {
  return v ? isValidMongoId(v, helpers) : true
}

export const isValidNumericString: (path: string) => CustomValidator = (
  path: string,
): ((v: string, helpers: CustomHelpers) => true | ErrorReport) => {
  return (v: string, helpers: CustomHelpers): true | ErrorReport => {
    return isNaN(Number(v))
      ? helpers.error('string.base', { key: path }, { path: [path] })
      : true
  }
}
