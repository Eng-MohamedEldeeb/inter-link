import { NextFunction, Request, Response } from "express"

export interface IError
  extends Pick<Partial<Error>, "stack" | "message" | "cause"> {
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
  res.status((error.cause as number) || error.status || 500).json({
    success: false,
    msg: error.message || error.msg,
    ...(error.details && { details: error.details }),
    error,
    stack: error.stack,
  })
}
