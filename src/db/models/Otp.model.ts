import { Schema, model, models } from "mongoose"
import { IOtp } from "../interfaces/IOtp.interface"
import { OtpType } from "./enums/otp.enum"
import { RandomString } from "../../common/utils/randomstring/generate-code.function"
import { hashValue } from "../../common/utils/security/bcrypt/bcrypt.service"
import { EmailService } from "../../common/services/email/email.service"
import { EmailSchemas } from "../../common/services/email/interface/send-args.interface"

import * as emailSchemas from "../../common/utils/nodemailer/schemas/email-schema"

export class OTP {
  private static readonly schema = new Schema<IOtp>(
    {
      otpCode: { type: String },
      email: {
        type: String,
        trim: true,
        required: [true, "email is required"],
        unique: [true, "can't request another otpCode at the moment"],
      },
      type: {
        type: String,
        enum: Object.keys(emailSchemas),
        default: OtpType.confirmRegistration,
      },
    },
    { timestamps: true },
  )

  private static readonly schemaFactory = () => {
    this.schema.index({ createdAt: 1 }, { expires: "1m" })

    this.schema.pre("save", function (next) {
      const email: string = this.email
      const type: EmailSchemas = this.type
      const otpCode = RandomString.generateCode({
        length: 4,
        charset: "numeric",
      })

      console.log({ otpCode })

      const hashedCode = hashValue(otpCode)
      this.otpCode = hashedCode

      EmailService.send({ schema: type, otpCode, to: email })

      return next()
    })

    return this.schema
  }

  public static readonly Model =
    models.Story ?? model(this.name, this.schemaFactory())
}
