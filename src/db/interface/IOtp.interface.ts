import { IMongoDoc } from './IMongo-doc.interface'

import * as emailSchemas from '../../common/services/email/schemas/email-schema'

export interface IOtpInputs {
  email: string
  type: keyof typeof emailSchemas
}
export interface IOtp extends IMongoDoc, IOtpInputs {
  otpCode: string
}
