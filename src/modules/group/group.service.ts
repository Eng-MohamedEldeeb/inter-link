import { MongoId } from './../../common/types/db/db.types'
import groupRepository from '../../common/repositories/group.repository'
import { ICreateGroup, IEditGroup } from './dto/group.dto'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { CloudUploader } from '../../common/services/upload/cloud.service'
import { IGroup } from '../../db/interface/IGroup.interface'

export class GroupService {
  private static readonly groupRepository = groupRepository
  private static readonly CloudUploader = CloudUploader

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
