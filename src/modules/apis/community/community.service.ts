import { Notify } from "../../../common/services/notify/notify.event"

import { communityRepository } from "../../../db/repositories"
import { ICreateCommunity, IEditCommunity } from "./dto/community.dto"

import { InteractionType } from "../../../db/interfaces/INotification.interface"

import { ICommunity } from "../../../db/interfaces/ICommunity.interface"
import { ICloudFile } from "../../../common/services/upload/interface/cloud-response.interface"
import { CloudUploader } from "../../../common/services/upload/cloud.service"
import { MongoId } from "../../../common/types/db"
import { currentMoment } from "../../../common/decorators/moment/moment"
import { IUser } from "../../../db/interfaces/IUser.interface"
import { throwError } from "../../../common/handlers/error-message.handler"

class CommunityService {
  private readonly communityRepository = communityRepository
  private readonly Notify = Notify
  private readonly CloudUploader = CloudUploader

  private userId!: MongoId
  private members!: MongoId[]
  private requests!: MongoId[]

  public readonly getAllCommunities = async () => {
    return await this.communityRepository.find({
      filter: {},
      projection: { "cover.path.secure_url": 1, name: 1, totalMembers: 1 },
    })
  }
  public readonly getCommunity = ({
    community,
    profileId,
  }: {
    community: ICommunity
    profileId: MongoId
  }) => {
    if (community.isPrivateCommunity && !profileId.equals(community.createdBy))
      return {
        totalMembers: community.totalMembers,
        name: community.name,
        cover: community.cover,
      }

    return community
  }

  public readonly getCommunityMembers = ({
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

    return {
      totalMembers: community.totalMembers,
      members: community.members,
    }
  }

  public readonly create = async ({
    createdBy,
    createCommunityDTO,
    cover,
  }: {
    createdBy: MongoId
    createCommunityDTO: ICreateCommunity
    cover?: ICloudFile
  }) => {
    return await this.communityRepository.create({
      ...createCommunityDTO,
      ...(cover &&
        cover.folderId && {
          cover,
        }),
      createdBy,
    })
  }

  public readonly changeCover = async ({
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
        projection: { "cover.secure_url": 1 },
      },
    })
  }

  public readonly changeVisibility = async ({
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

  public readonly editCommunity = async ({
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
        projection: Object.keys(editCommunity).join(" "),
        lean: true,
      },
    })
  }

  public readonly deleteCommunity = async (communityId: MongoId) => {
    await this.communityRepository.findOneAndDelete({
      filter: {
        _id: communityId,
      },
    })
  }

  public readonly join = async ({
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
      members,
    } = community

    this.userId = profileId
    this.members = members

    if (profileId.equals(createdBy))
      return "You are Already Joined as The Creator of This Community"

    if (this.isExistedMember()) return "You are Already Joined as a Member"

    if (!isPrivateCommunity) {
      await this.communityRepository.findOneAndUpdate({
        filter: {
          $and: [{ _id: communityId }, { isPrivateCommunity: false }],
        },
        data: {
          $addToSet: { members: profileId },
        },
      })

      // this.Notify.sendNotification({
      //   sender: profile,
      //   receiverId: createdBy,
      //   body: {
      //     message: `${username} Joined your community`,
      //     sentAt: currentMoment(),
      //     refTo: InteractionType.Community,
      //     relatedTo: communityId,
      //   },
      // })

      return `You Joined ${name} Community Successfully`
    }

    await this.communityRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: communityId }, { isPrivateCommunity: true }],
      },
      data: {
        $addToSet: { requests: profileId },
      },
    })

    // this.Notify.sendNotification({
    //   sender: profile,
    //   receiverId: createdBy,
    //   body: {
    //     message: `${username} Requested to join your community`,
    //     sentAt: currentMoment(),
    //     refTo: InteractionType.Community,
    //     relatedTo: communityId,
    //   },
    // })

    return `Join request was sent to ${name}'s Creator`
  }

  private readonly isExistedMember = () => {
    return this.members.some(requestedUserId =>
      requestedUserId.equals(this.userId),
    )
  }

  public readonly leave = async ({
    profileId,
    community,
  }: {
    profileId: MongoId
    community: ICommunity
  }) => {
    this.userId = profileId
    this.members = community.members

    if (!this.isExistedMember())
      return throwError({
        msg: "You are not a member of this Community",
        status: 400,
      })

    return await this.communityRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: community._id }, { isPrivateCommunity: true }],
      },
      data: {
        $pull: { members: profileId },
      },
    })
  }

  public readonly acceptJoinRequest = async ({
    user,
    community,
  }: {
    user: IUser
    community: ICommunity
  }) => {
    const { _id: communityId, createdBy, cover, name, requests } = community

    this.userId = user._id
    this.requests = requests

    // this.Notify.sendNotification({
    //   sender: community,
    //   receiverId: createdBy,
    //   body: {
    //     message: `${community.name} Accepted Your Join Request`,
    //     sentAt: currentMoment(),
    //     refTo: InteractionType.Community,
    //     relatedTo: communityId,
    //   },
    // })

    return await this.communityRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: communityId }, { isPrivateCommunity: true }],
      },
      data: {
        $set: { requests: this.filterJoinRequests() },
        $push: { members: this.userId },
      },
    })
  }

  public readonly rejectJoinRequest = async ({
    user,
    community,
  }: {
    user: IUser
    community: ICommunity
  }) => {
    const { _id: communityId, requests } = community

    this.requests = requests
    this.userId = user._id

    return await this.communityRepository.findOneAndUpdate({
      filter: {
        $and: [{ _id: communityId }, { isPrivateCommunity: true }],
      },
      data: {
        $set: { requests: this.filterJoinRequests() },
        $pull: { members: this.userId },
      },
    })
  }

  private filterJoinRequests = () => {
    return this.requests.filter(
      requestedUser => !requestedUser.equals(this.userId),
    )
  }

  public readonly addAdmin = async ({
    communityId,
    userId,
  }: {
    communityId: MongoId
    userId: MongoId
  }) => {
    await this.communityRepository.findByIdAndUpdate({
      _id: communityId,
      data: {
        $addToSet: { admins: userId },
      },
    })
  }

  public readonly removeAdmin = async ({
    community,
    admin,
  }: {
    community: ICommunity
    admin: IUser
  }) => {
    const { username } = admin
    const { members } = community

    if (!members.some(adminId => adminId.equals(adminId)))
      return throwError({ msg: `${username} Doesn't exist in thi community` })

    await this.communityRepository.findByIdAndUpdate({
      _id: community._id,
      data: {
        $pull: { admins: admin._id },
        $addToSet: { members: admin._id },
      },
    })
  }

  public readonly kickOut = async ({
    community,
    user,
  }: {
    community: ICommunity
    user: IUser
  }) => {
    const { username } = user
    const { members } = community

    if (!members.some(userId => userId.equals(userId)))
      return throwError({
        msg: `${username} Doesn't exist in community's members`,
      })

    await this.communityRepository.findByIdAndUpdate({
      _id: community._id,
      data: {
        $pull: { members: user._id },
      },
    })
  }
}

export default new CommunityService()
