import { Response } from 'express'

export const successResponse = (
  res: Response,
  {
    msg,
    status,
    data,
  }: { msg?: string; status?: number; data?: object | null },
) => {
  res.status(status ?? 200).json({
    success: true,
    ...(msg && { msg }),
    ...(data && { data }),
  })
}
