import rateLimit, { Options } from 'express-rate-limit'

type RateLimiterOptions = Partial<
  Pick<
    Options,
    | 'windowMs'
    | 'statusCode'
    | 'limit'
    | 'message'
    | 'skipFailedRequests'
    | 'skipSuccessfulRequests'
    | 'handler'
    | 'legacyHeaders'
    | 'standardHeaders'
  >
>

type LegacyHeaders = boolean | 'draft-6' | 'draft-7' | 'draft-8'

export const applyRateLimiter = (options?: RateLimiterOptions) => {
  return rateLimit({
    ...options,
    windowMs: options?.windowMs ?? Number(process.env.WINDOW_MS),
    limit: options?.limit ?? Number(process.env.REQUESTS_LIMIT),
    standardHeaders:
      options?.standardHeaders ??
      (process.env.STANDARD_HEADERS as LegacyHeaders),
    skipSuccessfulRequests: options?.skipSuccessfulRequests ?? false,
    legacyHeaders: options?.legacyHeaders ?? true,

    message: options?.message ?? {
      success: false,
      error: {
        msg: 'request limit reached',
      },
    },
  })
}
