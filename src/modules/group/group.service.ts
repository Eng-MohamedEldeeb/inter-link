import userRepository from '../../common/repositories/user.repository'
import groupRepository from '../../common/repositories/group.repository'

import { ICreateGroup, IEditGroup } from './dto/group.dto'

import { IGroup } from '../../db/interface/IGroup.interface'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { CloudUploader } from '../../common/services/upload/cloud.service'
import { throwError } from '../../common/handlers/error-message.handler'
import { IUser } from '../../db/interface/IUser.interface'
import { MongoId } from './../../common/types/db/db.types'

export class GroupService {
  private static readonly userRepository = userRepository
  private static readonly groupRepository = groupRepository
  private static readonly CloudUploader = CloudUploader
  protected static userId: MongoId
  protected static user: IUser
  protected static group: IGroup

  static readonly getGroup = ({
    group,
    profileId,
  }: {
    group: IGroup
    profileId: MongoId
  }) => {
    if (group.isPrivateGroup && !profileId.equals(group.createdBy))
      return {
        totalMembers: group.totalMembers,
      }

    return group
  }

  static readonly create = async ({
    createdBy,
    createGroup,
    cover,
  }: {
    createdBy: MongoId
    createGroup: ICreateGroup
    cover: ICloudFile
  }) => {
    return await this.groupRepository.create({
      ...createGroup,
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
    return this.group.admins.some(adminId => adminId.equals(this.user._id))
  }

  static readonly addAdmin = async ({
    group,
    userId,
  }: {
    group: IGroup
    userId: MongoId
  }) => {
    this.group = group
    this.userId = userId

    await this.isExistedUser()

    if (this.isAdmin())
      return throwError({
        msg: `user '${this.user.username}' is admin already`,
      })

    await this.groupRepository.findByIdAndUpdate({
      _id: this.group._id,
      data: {
        $addToSet: { admins: this.userId },
      },
    })
  }

  static readonly removeAdmin = async ({
    group,
    userId,
  }: {
    group: IGroup
    userId: MongoId
  }) => {
    this.group = group
    this.userId = userId

    await this.isExistedUser()

    if (!this.isAdmin())
      return throwError({
        msg: `user ${this.user.username} is not an admin`,
      })

    await this.groupRepository.findByIdAndUpdate({
      _id: this.group._id,
      data: {
        $pull: { admins: this.userId },
      },
    })
  }

  static readonly changeCover = async ({
    group,
    path,
  }: {
    group: IGroup
    path: string
  }) => {
    const hasDefaultCover =
      group.cover.path.secure_url == process.env.DEFAULT_PIC

    if (!hasDefaultCover) {
      const { secure_url, public_id } = await this.CloudUploader.upload({
        path,
        public_id: group.cover.path.public_id,
      })

      return await this.groupRepository.findByIdAndUpdate({
        _id: group._id,
        data: {
          cover: { path: { secure_url, public_id } },
        },
        options: { new: true, lean: true, projection: { cover: 1 } },
      })
    }

    const { secure_url, public_id } = await this.CloudUploader.upload({
      path,
      folderName: `${process.env.APP_NAME}/${group.createdBy.toString()}/groups/${group.slug}`,
    })

    return await this.groupRepository.findByIdAndUpdate({
      _id: group._id,
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

  static readonly changeVisibility = async ({
    groupId,
    state,
  }: {
    groupId: MongoId
    state: boolean
  }) => {
    const isExistedUser = await this.groupRepository.findOneAndUpdate({
      filter: {
        _id: groupId,
      },
      data: { isPrivateGroup: !state },
      options: {
        lean: true,
        new: true,
        projection: { isPrivateGroup: 1 },
      },
    })
  }

  static readonly edit = async ({
    groupId,
    editGroup,
  }: {
    groupId: MongoId
    editGroup: IEditGroup
  }) => {
    return await this.groupRepository.findOneAndUpdate({
      filter: {
        _id: groupId,
      },
      data: editGroup,
      options: { new: true, projection: Object.keys(editGroup).join(' ') },
    })
  }

  static readonly delete = async (groupId: MongoId) => {
    await this.groupRepository.findOneAndDelete({
      filter: {
        _id: groupId,
      },
    })
  }
}
