import { IOtp } from '../../db/models/interfaces/IOtp.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TOtp } from '../../db/models/types/document.type'
import { OtpModel } from '../../db/models/Otp/Otp.model'

class OtpRepository extends DataBaseService<IOtp, TOtp> {
  constructor(protected readonly otpModel: Model<TOtp> = OtpModel) {
    super(otpModel)
  }
}

export default new OtpRepository()
