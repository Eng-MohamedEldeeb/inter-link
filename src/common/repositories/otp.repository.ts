import { IOtp } from "../../db/interfaces/IOtp.interface"
import { Model } from "mongoose"
import { DataBaseService } from "../services/db/db.service"
import { TOtp } from "../../db/documents"
import { OtpModel } from "../../db/models/Otp/Otp.model"

class OtpRepository extends DataBaseService<IOtp, TOtp> {
  constructor(private readonly otpModel: Model<TOtp> = OtpModel) {
    super(otpModel)
  }
}

export default new OtpRepository()
