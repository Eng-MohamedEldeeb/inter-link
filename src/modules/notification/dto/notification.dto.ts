import { MongoId } from '../../../common/types/db'

export interface IGetNotification {
  id: MongoId
}
export interface IDeleteNotifications extends IGetNotification {
  profileId: MongoId
}
