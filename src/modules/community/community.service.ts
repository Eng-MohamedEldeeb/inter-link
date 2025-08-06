import userRepository from '../../common/repositories/user.repository'
import communityRepository from '../../common/repositories/community.repository'

import { ICreateCommunity, IEditCommunity } from './dto/community.dto'

import { ICommunity } from '../../db/interfaces/ICommunity.interface'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { CloudUploader } from '../../common/services/upload/cloud.service'
import { throwError } from '../../common/handlers/error-message.handler'
import { IUser } from '../../db/interfaces/IUser.interface'
import { MongoId } from '../../common/types/db'

export class CommunityService {
  protected static readonly userRepository = userRepository
  protected static readonly communityRepository = communityRepository
  protected static readonly CloudUploader = CloudUploader
  protected static userId: MongoId
  protected static user: IUser
  protected static community: ICommunity

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

  protected static readonly isExistedUser = async (): Promise<void> => {
    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: this.userId }, { deactivatedAt: { $exists: false } }],
      },
      projection: { _id: 1, username: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: 'In-valid userId', status: 400 })

    this.user = isExistedUser
  }

  protected static readonly isAdmin = (): boolean => {
    return this.community.admins.some(adminId => adminId.equals(this.user._id))
  }

  public static readonly addAdmin = async ({
    community,
    userId,
  }: {
    community: ICommunity
    userId: MongoId
  }) => {
    this.community = community
    this.userId = userId

    await this.isExistedUser()

    if (this.isAdmin())
      return throwError({
        msg: `user '${this.user.username}' is admin already`,
      })

    await this.communityRepository.findByIdAndUpdate({
      _id: this.community._id,
      data: {
        $addToSet: { admins: this.userId },
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
    this.community = community
    this.userId = userId

    await this.isExistedUser()

    if (!this.isAdmin())
      return throwError({
        msg: `user ${this.user.username} is not an admin`,
      })

    await this.communityRepository.findByIdAndUpdate({
      _id: this.community._id,
      data: {
        $pull: { admins: this.userId },
        $addToSet: { members: this.userId },
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
      folderName: `${process.env.APP_NAME}/${community.createdBy.toString()}/communitys/${community.slug}`,
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
    const isExistedUser = await this.communityRepository.findOneAndUpdate({
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

  public static readonly edit = async ({
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

  public static readonly delete = async (communityId: MongoId) => {
    await this.communityRepository.findOneAndDelete({
      filter: {
        _id: communityId,
      },
    })
  }
}
