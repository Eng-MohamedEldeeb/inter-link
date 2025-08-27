import userRepository from '../../common/repositories/user.repository'
import communityRepository from '../../common/repositories/community.repository'

import {
  ICreateCommunity,
  IEditCommunity,
  IJoinCommunity,
} from './dto/community.dto'

import { ICommunity } from '../../db/interfaces/ICommunity.interface'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { CloudUploader } from '../../common/services/upload/cloud.service'
import { MongoId } from '../../common/types/db'
import notificationsService from '../../common/services/notifications/notifications.service'
import { IUser } from '../../db/interfaces/IUser.interface'
import {
  IJoinedCommunityNotification,
  INotificationInputs,
} from '../../db/interfaces/INotification.interface'
import { getNowMoment } from '../../common/decorators/moment/moment'
import moment from 'moment'

export class CommunityService {
  protected static readonly userRepository = userRepository
  protected static readonly communityRepository = communityRepository
  protected static readonly notificationsService = notificationsService
  protected static readonly CloudUploader = CloudUploader

  protected static profileId: MongoId

  public static readonly getCommunity = ({
    community,
    profileId,
  }: {
    community: ICommunity
    profileId: MongoId
  }) => {
    if (community.isPrivateCommunity && !profileId.equals(community.createdBy))
      return {
        totalMembers: community.totalMembers,
      }

    return community
  }

  public static readonly create = async ({
    createdBy,
    createCommunityDTO,
    cover,
  }: {
    createdBy: MongoId
    createCommunityDTO: ICreateCommunity
    cover: ICloudFile
  }) => {
    return await this.communityRepository.create({
      ...createCommunityDTO,
      ...(cover.folderId && {
        cover,
      }),
      createdBy,
    })
  }

  public static readonly join = async ({
    profile,
    community,
  }: {
    profile: IUser
    community: ICommunity
  }) => {
    const { _id: profileId, username, avatar } = profile
    const {
      _id: communityId,
      isPrivateCommunity,
      createdBy,
      cover,
      name,
    } = community

    const notificationDetails: INotificationInputs = {
      from: { _id: profileId, username, avatar },
      message: isPrivateCommunity
        ? `${username} Requested to join your community`
        : `${username} Joined your community`,

      refTo: 'Community',
      on: { _id: communityId, cover, name },
      sentAt: getNowMoment(),
    }

    if (!isPrivateCommunity) {
      await this.communityRepository.findOneAndUpdate({
        filter: {
          $and: [{ _id: communityId }, { isPrivateCommunity: false }],
        },
        data: {
          $addToSet: { members: profileId },
        },
      })

      return await this.notificationsService.sendNotification({
        userId: createdBy,
        notificationDetails,
      })
    }

    await this.communityRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: communityId }, { isPrivateCommunity: true }],
      },
      data: {
        $addToSet: { requests: profileId },
      },
    })

    return await this.notificationsService.sendNotification({
      userId: createdBy,
      notificationDetails,
    })
  }

  public static readonly leave = async ({
    profileId,
    communityId,
  }: {
    profileId: MongoId
    communityId: MongoId
  }) => {
    return await this.communityRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: communityId }, { isPrivateCommunity: true }],
      },
      data: {
        $pull: { members: profileId },
      },
    })
  }

  public static readonly acceptJoinRequest = async ({
    profile,
    community,
  }: {
    profile: IUser
    community: ICommunity
  }) => {
    this.profileId = profile._id

    const {
      _id: communityId,
      isPrivateCommunity,
      createdBy,
      cover,
      name,
      requests,
    } = community

    const notificationDetails: IJoinedCommunityNotification = {
      from: { _id: communityId, name, cover: cover },
      message: `You are accepted to join ${name} community`,
      refTo: 'Community',
      on: { _id: communityId, cover, name },
      sentAt: getNowMoment(),
    }

    return await Promise.all([
      this.communityRepository.findOneAndUpdate({
        filter: {
          $and: [{ _id: communityId }, { isPrivateCommunity: true }],
        },
        data: {
          $set: { requests: this.filterJoinRequests(requests) },
          $push: { members: this.profileId },
        },
      }),
      this.notificationsService.sendNotification({
        userId: createdBy,
        notificationDetails,
      }),
    ])
  }

  protected static filterJoinRequests = (requests: MongoId[]) => {
    return requests.filter(
      requestedUser => !requestedUser.equals(this.profileId),
    )
  }

  public static readonly addAdmin = async ({
    community,
    userId,
  }: {
    community: ICommunity
    userId: MongoId
  }) => {
    await this.communityRepository.findByIdAndUpdate({
      _id: community._id,
      data: {
        $addToSet: { admins: userId },
      },
    })
  }

  public static readonly removeAdmin = async ({
    community,
    userId,
  }: {
    community: ICommunity
    userId: MongoId
  }) => {
    await this.communityRepository.findByIdAndUpdate({
      _id: community._id,
      data: {
        $pull: { admins: userId },
        $addToSet: { members: userId },
      },
    })
  }

  public static readonly changeCover = async ({
    community,
    path,
  }: {
    community: ICommunity
    path: string
  }) => {
    const hasDefaultCover =
      community.cover.path.secure_url == process.env.DEFAULT_PIC

    if (!hasDefaultCover) {
      const { secure_url, public_id } = await this.CloudUploader.upload({
        path,
        public_id: community.cover.path.public_id,
      })

      return await this.communityRepository.findByIdAndUpdate({
        _id: community._id,
        data: {
          cover: { path: { secure_url, public_id } },
        },
        options: { new: true, lean: true, projection: { cover: 1 } },
      })
    }

    const { secure_url, public_id } = await this.CloudUploader.upload({
      path,
      folderName: `${process.env.APP_NAME}/${community.createdBy.toString()}/communities/${community.slug}`,
    })

    return await this.communityRepository.findByIdAndUpdate({
      _id: community._id,
      data: {
        cover: { secure_url, public_id },
      },
      options: {
        new: true,
        lean: true,
        projection: { 'cover.secure_url': 1 },
      },
    })
  }

  public static readonly changeVisibility = async ({
    communityId,
    state,
  }: {
    communityId: MongoId
    state: boolean
  }) => {
    return await this.communityRepository.findOneAndUpdate({
      filter: {
        _id: communityId,
      },
      data: { isPrivateCommunity: !state },
      options: {
        lean: true,
        new: true,
        projection: { isPrivateCommunity: 1 },
      },
    })
  }

  public static readonly editCommunity = async ({
    communityId,
    editCommunity,
  }: {
    communityId: MongoId
    editCommunity: IEditCommunity
  }) => {
    return await this.communityRepository.findOneAndUpdate({
      filter: {
        _id: communityId,
      },
      data: editCommunity,
      options: {
        new: true,
        projection: Object.keys(editCommunity).join(' '),
        lean: true,
      },
    })
  }

  public static readonly deleteCommunity = async (communityId: MongoId) => {
    await this.communityRepository.findOneAndDelete({
      filter: {
        _id: communityId,
      },
    })
  }
}
