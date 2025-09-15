import { IOtp } from "../../db/interfaces/IOtp.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../db.service"
import { TOtp } from "../../db/documents"
import { OTP } from "../models"

class OtpRepository extends DataBaseService<IOtp, TOtp> {
  constructor(private readonly otpModel: Model<TOtp> = OTP.Model) {
    super(otpModel)
  }
}

export default new OtpRepository()
