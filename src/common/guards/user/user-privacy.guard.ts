import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { GuardActivator } from '../class/guard-activator.class'
import { MongoId } from '../../types/db'
import { ContextType } from '../../decorators/context/types'

import { GraphQLParams, HttpParams } from '../../decorators/context/types'
import { IUser } from '../../../db/interfaces/IUser.interface'

class UserPrivacyGuard extends GuardActivator {
  protected userId!: MongoId
  protected profileId!: MongoId
  protected following!: MongoId[]
  protected followers!: MongoId[]
  protected isPrivateProfile!: boolean

  canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      const { _id: profileId } = req.profile
      const {
        _id: userId,
        following,
        followers,
        isPrivateProfile,
        totalFollowers,
        totalFollowing,
        totalPosts,
        requests,
      } = req.user as IUser

      this.userId = userId
      this.profileId = profileId
      this.following = following
      this.followers = followers
      this.isPrivateProfile = isPrivateProfile

      if (!this.isAllowedToView()) {
        req.user = {
          _id: userId,
          isPrivateProfile,
          totalFollowers,
          totalFollowing,
          totalPosts,
          requests,
        } as IUser
      }
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      const { _id: profileId } = context.profile
      const {
        _id: userId,
        following,
        followers,
        isPrivateProfile,
        totalFollowers,
        totalFollowing,
        totalPosts,
        requests,
      } = context.user as IUser

      this.userId = userId
      this.profileId = profileId
      this.following = following
      this.followers = followers
      this.isPrivateProfile = isPrivateProfile

      if (!this.isAllowedToView()) {
        context.user = {
          _id: userId,
          isPrivateProfile,
          totalFollowers,
          totalFollowing,
          totalPosts,
          requests,
        } as IUser
      }
    }

    return true
  }

  protected readonly isAllowedToView = (): boolean => {
    if (this.following.length)
      return this.following.some((followedUser: MongoId) =>
        followedUser.equals(this.profileId),
      )

    if (this.followers.length)
      return this.followers.some((followedUser: MongoId) =>
        followedUser.equals(this.profileId),
      )
    return false
  }
}

export default new UserPrivacyGuard()
