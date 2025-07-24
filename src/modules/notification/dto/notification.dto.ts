import { MongoId } from '../../../common/types/db/db.types'

export interface IGetNotification {
  id: MongoId
}
export interface IDeleteNotifications extends IGetNotification {
  profileId: MongoId
}
