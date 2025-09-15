import { IEmailSchemaArgs } from "../../../utils/nodemailer/schemas/interface/email-schema.interface"

import * as emailSchemaTypes from "../../../utils/nodemailer/schemas/email-schema"

export type EmailSchemas = keyof typeof emailSchemaTypes

export interface ISendArgs extends IEmailSchemaArgs {
  schema: EmailSchemas
}
