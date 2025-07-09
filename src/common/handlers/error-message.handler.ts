import { IError } from './http/global-error.handler'

export const throwError = ({ msg, status, details, stack }: IError) => {
  throw {
    status,
    msg,
    ...(details && { details }),
    ...(stack && { stack }),
  }
}
