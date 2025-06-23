import { CustomValidator, ErrorReport } from 'joi'
import { Types } from 'mongoose'

export const isValidMongoId: CustomValidator = (
  v: string,
  helpers,
): true | ErrorReport => {
  return Types.ObjectId.isValid(v)
    ? true
    : helpers.error('string.hex', { key: 'id' }, { path: ['id'] })
}

export const optionalMongoId: CustomValidator = (v: string, helpers) => {
  return v ? isValidMongoId(v, helpers) : true
}
