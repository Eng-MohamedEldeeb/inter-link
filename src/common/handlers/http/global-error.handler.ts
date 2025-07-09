import { NextFunction, Request, Response } from 'express'

export interface IError extends Pick<Partial<Error>, 'stack' | 'message'> {
  msg: string
  details?: Object
  status?: number
}

export const globalError = (
  error: IError,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  res.status(error.status || 500).json({
    success: false,
    error: {
      msg: error.msg || error.message,
      ...(error.details && { details: error.details }),
    },
    stack: error.stack,
  })
}
